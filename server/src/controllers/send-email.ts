import { User } from '../database';
import { NotFoundUserError } from '../errors';
import * as mustache from 'mustache';

import * as uuidV4 from 'uuid/v4';
import { getTransporter } from './smtp';
import { getServerConfig } from './server-config';
import { createEnrollment } from './enrollment';
// import * as nodemailer from 'nodemailer';
import { readFileSync } from 'fs';
import * as path from 'path';
import log = require('loglevel');

function getLogo(config): String {
  if (config.publicInfo.logoURL) {
    return config.publicInfo.logoURL;
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

  const link = webClientURL + '/reset-password?token=' +
    token + '&email=' + email;

  let subject;
  let html;
  const logo = getLogo(config);

  if (user.getDataValue('passwordHash') === null) {
    html = mustache.render(config.mailOnboardingTemplate,
      { resetPasswordURL: link, domain: null, logoURL: logo, userName: user.getDataValue('x500CommonName') });
    subject = 'Onboarding';
  } else {
    html = mustache.render(config.mailResetPasswordTemplate,
      { resetPasswordURL: link, organizationName: config.organizationName, logoURL: logo, userName: user.getDataValue('x500CommonName') });
    subject = 'Password recovery';
  }

  try {
    await sendEmail(email, subject, html);
  } catch (err) {
    log.error(err);
  }

  return user.toJSON();
}

export async function sendKeyEnrollmentEmail(email: string): Promise<InternalEnrollmentObject> {
  const user = await User.getByEmail(email);
  if (!user) {
    throw new NotFoundUserError();
  }

  const enrollment = await createEnrollment(user.get('id'));
  const config = getServerConfig();
  const webClientURL = config.webClientURL;

  const link = webClientURL + '/enrollment/' +
    enrollment.id;
  const logo = getLogo(config);
  const subject = 'Register your signature key';
  const html = mustache.render(config.mailKeyEnrollmentTemplate,
    { keyEnrollmentURL: link, organizationName: config.organizationName, logoURL: logo, userName: user.getDataValue('x500CommonName') });

  try {
    await sendEmail(email, subject, html);
  } catch (err) {
    log.error(err);
  }

  return enrollment;
}

export async function sendEnrollmentFinalizeEmail(userName: string, address: string, success: boolean): Promise<void> {
  const config = getServerConfig();
  const logo = getLogo(config);

  const subject = 'Key registration confirmation';
  const template = readFileSync(
    path.join(__dirname, '../../assets/defaultAdminEnrollmentConfirmationMailTemplate.html'), { encoding: 'ascii' });
  const html = mustache.render(template,
    { organizationName: config.organizationName, logoURL: logo, userName, address, success });

  try {
    await sendEmail(config.contact, subject, html);
  } catch (err) {
    log.error(err);
  }
}

export async function sendEmail(email: string, subject: string, html: any) {

  // with ethereal. Catch the email with the url sent in the console.

  // const account = await nodemailer.createTestAccount();

  // const transporter = nodemailer.createTransport({
  //   host: 'smtp.ethereal.email',
  //   port: 587,
  //   secure: false,
  //   tls: {
  //     // do not fail on invalid certs
  //     rejectUnauthorized: false
  //   },
  //   auth: {
  //     user: account.user, // generated ethereal user
  //     pass: account.pass  // generated ethereal password
  //   }
  // });

  // with configurated SMTP server

  const transporter = getTransporter();

  await transporter.sendMail(MailTemplate(email, subject, html), function (err, info) {
    if (err) {
      log.error(err);
    } else {
      log.info(info);
      log.info('Message sent: %s', info.messageId);
      // Preview only available when sending through an Ethereal account
      // log.info('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
  });
}

function MailTemplate(email: string, subject: string, html: any): object {
  const organizationName = getServerConfig().organizationName;
  return {
    from: organizationName + ' no-reply@' + organizationName + '.com',
    to: email,
    subject: subject,
    html: html
  };
}
