import { User } from '../database';
import { NotFoundUserError } from '../errors';
import * as mustache from 'mustache';
import * as fs from 'fs';
import * as path from 'path';

import * as uuidV4 from 'uuid/v4';
import { getTransporter } from './smtp';
import log = require('loglevel');
import { getServerConfig } from './server-config';

export async function sendResetPasswordEmail(email: string): Promise<InternalUserObject> {
  let user = await User.getByEmail(email);
  if (!user) {
    throw new NotFoundUserError();
  }

  const uuid = uuidV4();

  const token = uuid + '_' + Date.now();

  const update = Object.assign({}, { tokenResetPassword: token });

  user = await User.update(user.getDataValue('id'), update);

  const ServerClientURL = getServerConfig().ServerClientURL;

  const link = ServerClientURL + '/reset-password?token=' +
    token + '&email=' + email;

  let subject;
  let file;

  if ( user.getDataValue('passwordHash') === null) {
    file = readFile('../../assets/defaultOnboardingMailTemplate.html');
    subject = 'Onboarding';
  } else {
    file = readFile('../../assets/defaultPasswordResetMailTemplate.html');
    subject = 'Password recovery';
  }

  const html = await file.then((template) => mustache.render(template,
    { validationURL: link, domain: null, userName: user.getDataValue('x500CommonName') }));

  try {
    await sendEmail(email, subject, html);
  } catch (err) {
    log.error(err);
  }

  return user.toJSON();
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

function readFile(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, file), 'utf8', (err, data) => {
      if (err) {
        reject(err);
      }
      const template = data.replace(/\n+ */g, ''); // remove space after \n
      mustache.parse(template); // optional, speeds up future uses
      resolve(template);
    });
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
