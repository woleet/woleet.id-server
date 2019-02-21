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

  if (!config.SMTPHost) {
    debug('no SMTPHost set, skipping configuration');
    log.warn('No SMTPHost set while SMTP is enabled, skipping configuration');
    return;
  }

  if (!config.SMTPPort) {
    debug('no SMTPPort set, skipping configuration');
    log.warn('No SMTPPort set while SMTP is enabled, skipping configuration');
    return;
  }

  if (!config.SMTPUser) {
    debug('no SMTPUser set, skipping configuration');
    log.warn('No SMTPUser set while SMTP is enabled, skipping configuration');
    return;
  }

  if (!config.SMTPSecret) {
    debug('no SMTPSecret set, skipping configuration');
    log.warn('No SMTPSecret set while SMTP is enabled, skipping configuration');
    return;
  }

  const { SMTPHost, SMTPPort, SMTPUser, SMTPSecret, SMTPService } = getServerConfig();

  transporter = nodemailer.createTransport({
    host: SMTPHost,
    port: SMTPPort,
    service: SMTPService,
    auth: {
      user: SMTPUser,
      pass: SMTPSecret
    }
  });

  // transporter = await nodemailer.createTransport({
  //   host: 'smtp.sendgrid.net',
  //   port: 587,
  //   service: 'SenGrid',
  //   auth: {
  //     user: 'apikey',
  //     pass: ''''
  //   }
  // });

  await transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
      Error('Bad configuration');
    } else {
      console.log('Server is ready to take our messages');
    }
  });
}

export function initializeSMTP() {
  return configure();
}

export function updateSMTP() {
  return configure();
}
