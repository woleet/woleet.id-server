import { User } from '../database';
import { NotFoundUserError } from '../errors';
import * as mustache from 'mustache';

import * as uuidV4 from 'uuid/v4';
import { getTransporter } from './smtp';
import { getServerConfig } from './server-config';
import { createOnboarding } from './onboarding';
import log = require('loglevel');
import * as nodemailer from 'nodemailer';

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

  const ServerClientURL = config.ServerClientURL;

  const link = ServerClientURL + '/reset-password?token=' +
    token + '&email=' + email;

  let subject;
  let html;
  const logo = getLogo(config);

  if (user.getDataValue('passwordHash') === null) {
    html = mustache.render(config.mailOnboardingTemplate,
      { validationURL: link, domain: null, logoURL: logo, userName: user.getDataValue('x500CommonName') });
    subject = 'Onboarding';
  } else {
    html = mustache.render(config.mailResetPasswordTemplate,
      { resetPasswordURL: link, domain: null, logoURL: logo, userName: user.getDataValue('x500CommonName') });
    subject = 'Password recovery';
  }

  try {
    await sendEmail(email, subject, html);
  } catch (err) {
    log.error(err);
  }

  return user.toJSON();
}

export async function sendKeyEnrolmentEmail(email: string): Promise<InternalOnboardingObject> {
  const user = await User.getByEmail(email);
  if (!user) {
    throw new NotFoundUserError();
  }

  const onboarding = await createOnboarding(user.get('id'));
  const config = getServerConfig();
  const ServerClientURL = config.ServerClientURL;

  const link = ServerClientURL + '/enrolment/' +
    onboarding.id;
  const logo = getLogo(config);
  const subject = 'Enrolment';
  const html = mustache.render(config.mailKeyEnrolmentTemplate,
    { keyEnrolmentURL: link, domain: null, logoURL: logo, userName: user.getDataValue('x500CommonName') });

  try {
    await sendEmail(email, subject, html);
  } catch (err) {
    log.error(err);
  }

  return onboarding;
}

export async function sendEmail(email: string, subject: string, html: any) {

  // with ethereal. Catch the email with the url sent in the console.

  const account = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false
    },
    auth: {
      user: account.user, // generated ethereal user
      pass: account.pass  // generated ethereal password
    }
  });

  // with configurated SMTP server

  // const transporter = getTransporter();

  await transporter.sendMail(MailTemplate(email, subject, html), function (err, info) {
    if (err) {
      log.error(err);
    } else {
      log.info(info);
      log.info('Message sent: %s', info.messageId);
      // Preview only available when sending through an Ethereal account
      log.info('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
  });
}

function MailTemplate(email: string, subject: string, html: any): object {
  return {
    from: 'Woleet no-reply@woleet.com',
    to: email,
    subject: subject,
    html: html
  };
}
