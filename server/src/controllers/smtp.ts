import * as nodemailer from 'nodemailer';
import { getServerConfig, setServerConfig } from './server-config';
import * as Debug from 'debug';
import * as log from 'loglevel';

const debug = Debug('id:ctrl:openid');

let transporter = null;
export const getTransporter = () => transporter;

async function configure() {
  const config = getServerConfig();

  if (!config.useSMTP) {
    debug('useSMTP=false, skipping configuration');
    return;
  }

  if (!config.SMTPConfig) {
    debug('no SMTPConfig set, skipping configuration');
    log.warn('No SMTPConfig set while SMTP is enabled, skipping configuration');
    return;
  }

  const { SMTPConfig } = getServerConfig();

  transporter = await nodemailer.createTransport(JSON.parse(SMTPConfig));

  return new Promise((resolve, reject) => {
    transporter.verify(function (error, success) {
      if (error) {
        reject(error.response);
      } else {
        log.info('Server is ready to take our messages');
        resolve();
      }
    });
  });
}

export function initializeSMTP() {
  return configure();
}

export function updateSMTP() {
  return configure();
}
