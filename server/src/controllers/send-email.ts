import { User } from '../database';
import { NotFoundUserError } from '../errors';
import * as mustache from 'mustache';
import * as uuidV4 from 'uuid/v4';
import { getTransporter } from './smtp';
import { getServerConfig } from './server-config';
import { readFileSync } from 'fs';
import { BadRequest } from 'http-errors';
import * as path from 'path';
import * as log from 'loglevel';

const MANAGER_RESET_PASSWORD_TOKEN_LIFETIME = 7 * 24 * 3600 * 1000;
const USER_RESET_PASSWORD_TOKEN_LIFETIME = 3600 * 1000;

/**
 * Get the logo url from the server configuration if it's unset, get the Woleet logo.
 * @param config Server configuration
 */
function getLogo(config: InternalServerConfigObject): String {
  if (config.logoURL) {
    return config.logoURL;
  } else {
    return 'https://app.woleet.io/resources/images/logo.png';
  }
}

export async function askResetPasswordEmail(email: string): Promise<InternalUserObject> {

  // Check that user exists
  const user = await User.getByEmail(email);
  if (!user) {
    throw new NotFoundUserError();
  }

  // Build the password reset demand email
  const config = getServerConfig();
  const webClientURL = config.webClientURL;
  const link = webClientURL + '/user/' + user.get('id');
  const logo = getLogo(config);
  const subject = 'Please validate password reset request';
  const template = readFileSync(
    path.join(__dirname, '../../assets/defaultAskForPasswordReset.html'),
    { encoding: 'ascii' }
  );

  // Search all active manager except the requester
  let managers = await User.getByRole('manager');
  managers = managers.filter((manager) => manager.get('email')
    && user.get('id') !== manager.get('id')
    && manager.get('status') === 'active');

  // If manager are not found search all active admin except the requester
  if (!managers.length) {
    managers = await User.getByRole('admin');
    managers = managers.filter((admin) => admin.get('email')
      && user.get('id') !== admin.get('id')
      && admin.get('status') === 'active');

    // If no admin are not found send an error message with the contact if it is configured
    if (!managers.length) {
      if (config.contact) {
        throw new BadRequest('Unable to contact a manager please contact ' + config.contact);
      } else {
        throw new BadRequest('Unable to contact a manager');
      }
    }
  }

  // For all manager/admin send an email following the template
  managers.forEach(async (manager) => {
    if (manager.get('email')) {
      const html = mustache.render(template, {
        organizationName: config.organizationName,
        logoURL: logo,
        userName: manager.get('x500CommonName'),
        requesterName: user.get('x500CommonName'),
        link
      });
      await sendEmail(manager.get('email'), subject, html);
    }
  });

  return user.toJSON();
}

export async function sendResetPasswordEmail(email: string, managerId: string): Promise<InternalUserObject> {

  // Check that user exists
  let user = await User.getByEmail(email);
  if (!user) {
    throw new NotFoundUserError();
  }

  // Build a password reset token: if a manager initiated the procedure, the token expires after 7 days,
  // if it's the user himself, then the token expired 1 hour later
  let token: string;
  const uuid = uuidV4();
  if (managerId && (user.get('id') !== managerId)) {
    token = uuid + '_' + (Date.now() + MANAGER_RESET_PASSWORD_TOKEN_LIFETIME);
  } else {
    token = uuid + '_' + (Date.now() + USER_RESET_PASSWORD_TOKEN_LIFETIME);
  }

  // Remember the token
  const update = Object.assign({}, { tokenResetPassword: token });
  user = await User.update(user.getDataValue('id'), update);

  // Build the password reset email
  const config = getServerConfig();
  const webClientURL = config.webClientURL;
  const link = webClientURL + '/reset-password?token=' + token + '&email=' + email;

  // If the password is not set, send an onboarding mail
  let subject, html: string;
  const logo = getLogo(config);
  if (user.getDataValue('passwordHash') === null) {
    html = mustache.render(config.mailOnboardingTemplate, {
      resetPasswordURL: link,
      domain: null,
      logoURL: logo,
      userName: user.getDataValue('x500CommonName')
    });
    subject = 'Onboarding';
  }

  // If the password is set send a password reset mail
  else {
    html = mustache.render(config.mailResetPasswordTemplate, {
      resetPasswordURL: link,
      organizationName: config.organizationName,
      logoURL: logo,
      userName: user.getDataValue('x500CommonName')
    });
    subject = 'Password recovery';
  }

  // Send the email
  try {
    await sendEmail(email, subject, html);
  } catch (err) {
    log.error(err);
  }

  return user.toJSON();
}

export async function sendKeyEnrollmentEmail(user: InternalUserObject, enrollmentID: string): Promise<void> {

  const config = getServerConfig();
  const webClientURL = config.webClientURL;

  const link = webClientURL + '/enrollment/' + enrollmentID;
  const logo = getLogo(config);
  const subject = 'Register your signature key';
  const html = mustache.render(config.mailKeyEnrollmentTemplate, {
    keyEnrollmentURL: link,
    organizationName: config.organizationName,
    logoURL: logo,
    userName: user.x500CommonName
  });

  try {
    await sendEmail(user.email, subject, html);
  } catch (err) {
    log.error(err);
  }

  return;
}

export async function sendEnrollmentFinalizeEmail(userName: string, address: string, success: boolean, reason: string): Promise<void> {
  const config = getServerConfig();
  const logo = getLogo(config);
  const subject = 'Key registration ' + (success ? 'success' : 'failure');
  const template = readFileSync(
    path.join(__dirname, '../../assets/defaultAdminKeyEnrollmentStatusMailTemplate.html'),
    { encoding: 'ascii' }
  );
  const html = mustache.render(template, {
    organizationName: config.organizationName,
    logoURL: logo,
    userName,
    address,
    success,
    reason
  });

  try {
    await sendEmail(config.contact, subject, html);
  } catch (err) {
    log.error(err);
  }
}

export async function sendKeyRevocationEmail(user: InternalUserObject, key: InternalKeyObject) {
  const config = getServerConfig();
  const logo = getLogo(config);
  const subject = 'Key revocation';
  const template = readFileSync(
    path.join(__dirname, '../../assets/defaultKeyRevocationTemplate.html'),
    { encoding: 'ascii' }
  );

  try {
    // Send a revocation email to the owner of the key
    const htmlUser = mustache.render(template, {
      organizationName: config.organizationName,
      logoURL: logo,
      userName: user.x500CommonName,
      keyName: key.name,
      admin: false
    });
    await sendEmail(user.email, subject, htmlUser);

    // Send a revocation email to all admins having an email
    const admins = await User.getByRole('admin');
    admins.forEach(async (admin) => {
      if (admin.get('email')) {
        const htmlAdmin = mustache.render(template, {
          organizationName: config.organizationName,
          logoURL: logo,
          userName: admin.get('x500CommonName'),
          admin: true,
          keyId: key.id,
          keyName: key.name,
          ownerName: user.x500CommonName,
          ownerId: user.id
        });
        await sendEmail(admin.get('email'), subject, htmlAdmin);
      }
    });
  } catch (err) {
    log.error(err);
  }
}

export async function sendEmail(email: string, subject: string, html: any) {
  const transporter = getTransporter();
  await transporter.sendMail(MailTemplate(email, subject, html), function (err, info) {
    if (err) {
      log.error(err);
    } else {
      log.info('Message sent', info);
    }
  });
}

/**
 * Generate the transporter parameter to send the mail.
 * @param email The user email
 * @param subject The mail subject
 * @param html The mail body
 */
function MailTemplate(email: string, subject: string, html: any): object {
  const organizationName = getServerConfig().organizationName;
  const contactDomain = getServerConfig().contact ?
    getServerConfig().contact.split('@')[1] : 'Woleet';
  return {
    from: organizationName + ' no-reply@' + contactDomain,
    to: email,
    subject: subject,
    html: html
  };
}
