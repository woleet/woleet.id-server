import { User } from '../database';
import { NotFoundUserError } from '../errors';
import * as mustache from 'mustache';
import * as uuidV4 from 'uuid/v4';
import { getTransporter } from './smtp';
import { getServerConfig } from './server-config';
import { readFileSync } from 'fs';
import * as path from 'path';
import * as log from 'loglevel';

/**
 * Get the logo url from the server configuration if it's unset, get the Woleet logo.
 * @param config Server configuration
 */
function getLogo(config: InternalServerConfigObject): String {
  if (config.logoURL) {
    return config.logoURL;
  } else {
    return 'https://www.woleet.io/wp-content/uploads/2018/12/Woleet-logo-black-big-e1550678072706.png';
  }
}

export async function sendResetPasswordEmail(email: string): Promise<InternalUserObject> {
  let user = await User.getByEmail(email);
  if (!user) {
    throw new NotFoundUserError();
  }

  const config = getServerConfig();

  const uuid = uuidV4();

  const token = uuid + '_' + Date.now();

  const update = Object.assign({}, { tokenResetPassword: token });

  user = await User.update(user.getDataValue('id'), update);

  const webClientURL = config.webClientURL;

  const link = webClientURL + '/reset-password?token=' + token + '&email=' + email;

  let subject;
  let html;
  const logo = getLogo(config);

  // If the password is not set send an onboarding mail
  if (user.getDataValue('passwordHash') === null) {
    html = mustache.render(config.mailOnboardingTemplate, {
      resetPasswordURL: link,
      domain: null,
      logoURL: logo,
      userName: user.getDataValue('x500CommonName')
    });
    subject = 'Onboarding';
    // If the password is set send an reset password mail
  } else {
    html = mustache.render(config.mailResetPasswordTemplate, {
      resetPasswordURL: link,
      organizationName: config.organizationName,
      logoURL: logo,
      userName: user.getDataValue('x500CommonName')
    });
    subject = 'Password recovery';
  }

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

export async function sendEnrollmentFinalizeEmail(userName: string, address: string, success: boolean): Promise<void> {
  const config = getServerConfig();
  const logo = getLogo(config);
  const subject = 'Key registration ' + (success ? 'success' : 'failure');
  const template = readFileSync(
    path.join(__dirname, '../../assets/defaultAdminEnrollmentConfirmationMailTemplate.html'),
    { encoding: 'ascii' }
  );
  const html = mustache.render(template, {
    organizationName: config.organizationName,
    logoURL: logo,
    userName,
    address,
    success
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
  const htmlUser = mustache.render(template, {
    organizationName: config.organizationName,
    logoURL: logo,
    userName: user.x500CommonName,
    keyName: key.name,
    admin: false
  });

  const admins = await User.getByRole('admin');

  try {
    await sendEmail(user.email, subject, htmlUser);
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
          userId: user.id
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
