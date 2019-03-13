import { User } from '../database';
import { NotFoundUserError } from '../errors';
import * as mustache from 'mustache';
import * as fs from 'fs';
import * as path from 'path';
import { server } from '../config';

import * as uuidV4 from 'uuid/v4';
import { getTransporter } from './smtp';

export async function sendEmail(email: string, referer: string): Promise<InternalUserObject> {
  let user = await User.getByEmail(email);

  if (!user) {
    throw new NotFoundUserError();
  }

  const token = uuidV4();

  const update = Object.assign({}, { tokenResetPassword: token });

  user = await User.update(user.getDataValue('id'), update);

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

  const link = referer + '?token=' +
    token + '&email=' + email;

  const file = readFile('../../assets/defaultMailTemplate.html');
  const html = await file.then((template) => mustache.render(template,
    { validationURL: link, domain: server.host, userName: user.getDataValue('x500CommonName') }));

  await transporter.sendMail(MailTemplate(email, user, html), function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
      console.log('Message sent: %s', info.messageId);
      // Preview only available when sending through an Ethereal account
      // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
  });
  return user.toJSON();
}

function readFile(file) {
  return new Promise((resolve, reject) => {
      fs.readFile(path.join(__dirname, file), 'utf8', (err, data) => {
          if (err) {reject(err); }
          const template = data.replace(/\n+ */g, ''); // remove space after \n
          mustache.parse(template);   // optional, speeds up future uses
          resolve(template);
      });
  });
}

function MailTemplate(email: string, user: SequelizeUserObject, html: any): object {
  return {
    from: 'Woleet no-reply@woleet.com',
    to: email,
    subject: 'Password recovery',
    html: html
  };
}
