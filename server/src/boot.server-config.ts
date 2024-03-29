import { loadServerConfig, setServerConfig } from './controllers/server-config';
import { logger } from './config';
import * as Debug from 'debug';
import { Key } from './database';
import { randomBytes } from 'crypto';
import { createUser } from './controllers/user';
import { exit } from './exit';
import { readFileSync } from 'fs';
import * as path from 'path';
import { serverConfig } from './config';
import { signMessage } from './controllers/sign';

const debug = Debug('id:boot.server-config');

export async function initServerConfig() {
  const config = await loadServerConfig();
  if (config) {
    logger.info(`Server configuration successfully restored`);
    const printedConf = config;
    delete printedConf.mailKeyEnrollmentTemplate;
    delete printedConf.mailOnboardingTemplate;
    delete printedConf.mailResetPasswordTemplate;
    debug(JSON.stringify(config, null, 2));

    const key = await Key.model.findOne({ where: { holder: 'server', status: 'active' } });
    if (!key) {
      logger.warn('No private key in the database, cannot check secret restoration');
      return;
    }

    logger.info('Checking that the secret is correct...');
    try {
      await signMessage(key, randomBytes(32).toString('hex'));
    } catch (err) {
      logger.warn(err.message);
      throw new Error('Secret is not the same that the previously set one');
    }
    if (!config.mailOnboardingTemplate) {
      logger.warn('The onboarding template is set to default');
      config.mailOnboardingTemplate = readFileSync(
        path.join(__dirname, '../assets/defaultOnboardingMailTemplate.html'), { encoding: 'ascii' });
    }
    if (!config.mailResetPasswordTemplate) {
      logger.warn('The reset password template is set to default');
      config.mailResetPasswordTemplate = readFileSync(
        path.join(__dirname, '../assets/defaultPasswordResetMailTemplate.html'), { encoding: 'ascii' });
    }
    if (!config.mailKeyEnrollmentTemplate) {
      logger.warn('The key enrollment mail template is set to default');
      config.mailKeyEnrollmentTemplate = readFileSync(
        path.join(__dirname, '../assets/defaultKeyEnrollmentMailTemplate.html'), { encoding: 'ascii' });
    }
    if (!config.organizationName) {
      logger.warn('The organization name is set as Woleet');
      config.organizationName = 'Woleet';
    }
  } else {
    logger.warn('Creating a new server configuration with a default admin user...');
    let admin;
    try {
      admin = await createUser({
        password: 'pass',
        role: 'admin',
        username: 'admin',
        identity: { commonName: 'Admin' },
        mode: 'esign'
      });
      logger.info(`Created user "admin" with id ${admin.id}`);
    } catch (err) {
      return exit(`Cannot create user "admin": ${err.message}`, err);
    }

    const conf = await setServerConfig(serverConfig.default);
    const printedConf = Object.assign({}, conf);
    delete printedConf.mailKeyEnrollmentTemplate;
    delete printedConf.mailOnboardingTemplate;
    delete printedConf.mailResetPasswordTemplate;
    logger.info(`Created new server configuration with defaults: ${JSON.stringify(printedConf, null, 2)}`);
  }
}
