import * as nodemailer from 'nodemailer';
import { getServerConfig } from './server-config';
import * as Debug from 'debug';
const debug = Debug('id:ctrl:openid');
import * as log from 'loglevel';

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

  transporter = nodemailer.createTransport(JSON.parse(SMTPConfig));

  await transporter.verify(function (error, success) {
    if (error) {
      log.error(error);
      Error('Bad configuration');
    } else {
      log.info('Server is ready to take our messages');
    }
  });
}

export function initializeSMTP() {
  return configure();
}

export function updateSMTP() {
  return configure();
}
