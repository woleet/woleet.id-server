import { Sequelize } from 'sequelize';
import { logger } from '../config';
import * as read from 'read';
import * as crypto from 'crypto';
import { APIToken, Key, ServerConfig, User } from '.';
import { secretEnvVariableName, secureModule, serverConfig } from '../config';
import { promisify } from 'util';

const { CONFIG_ID } = serverConfig;
let doPostUpgrade3 = false;
let doPostUpgrade5 = false;
let doPostUpgrade8 = false;
let doPostUpgrade10 = false;

async function getConfig() {
  await ServerConfig.model.sync();
  const config = await ServerConfig.getById(CONFIG_ID);
  if (!config) {
    return;
  }
  return config.getDataValue('config');
}

async function upgrade1(sequelize) {
  logger.warn('Checking for update of the "serverConfig" model...');
  let old;
  try {
    const [model] = await sequelize.query(`SELECT *
                                           FROM "ServerConfigs" AS config
                                           WHERE config.id = '${serverConfig.CONFIG_ID}';`);
    old = model[0];
  } catch {
  }

  if (old) {
    logger.warn('Need to upgrade configuration model...');
    logger.warn('Old model value is', JSON.stringify(old, null, 2));
    const config = Object.assign({}, old);
    delete config.id;
    delete config.createdAt;
    delete config.updatedAt;

    await ServerConfig.model.sync();

    logger.warn('Copying old configuration to new table...');
    const { createdAt, updatedAt } = old;
    await ServerConfig.create({ config, createdAt, updatedAt });

    logger.warn('Dropping old configuration table...');
    await sequelize.query('DROP TABLE "ServerConfigs";');
  }
}

async function upgrade2(sequelize) {
  logger.warn('Checking for update of the "keys" model...');
  const config = await getConfig();
  if (config && !config.version) {
    logger.warn('Need to add "expiration" column to the "keys" table');
    const res = await sequelize.query(`ALTER TABLE "keys"
        ADD COLUMN expiration TIMESTAMP WITH TIME ZONE;`);
        logger.debug(res);
    await ServerConfig.update(CONFIG_ID, { config: Object.assign({ version: 1 }, config) });
  }
}

async function upgrade3(sequelize) {
  logger.warn('Checking for update of the "keys" model...');
  const config = await getConfig();
  if (config && config.version < 2) {
    doPostUpgrade3 = true;
    logger.warn('Need to add "privateKeyIV" and "mnemonicEntropyIV" column to the "keys" table');
    const privateKeyIV = await sequelize.query(`ALTER TABLE "keys"
        ADD COLUMN "privateKeyIV" CHAR(${16 * 2});`);
    logger.debug(privateKeyIV);
    const mnemonicEntropyIV = await sequelize.query(`ALTER TABLE "keys"
        ADD COLUMN "mnemonicEntropyIV" CHAR(${16 * 2});`);
    logger.debug(mnemonicEntropyIV);
    await ServerConfig.update(CONFIG_ID, { config: Object.assign(config, { version: 2 }) });
  }
}

async function upgrade4(sequelize) {
  logger.warn('Checking for update of the "user" model...');
  const config = await getConfig();
  if (config && config.version < 4) {
    logger.warn('Need to add "phone" and "countryCallingCode" column to the "users" table');
    const phone = await sequelize.query(`ALTER TABLE "users"
        ADD COLUMN "phone" VARCHAR;`);
        logger.debug(phone);
    const countryCallingCode = await sequelize.query(`ALTER TABLE "users"
        ADD COLUMN "countryCallingCode" VARCHAR;`);
        logger.debug(countryCallingCode);
    await ServerConfig.update(CONFIG_ID, { config: Object.assign(config, { version: 4 }) });
  }
}

async function upgrade5(sequelize) {
  logger.warn('Checking for update of the "apiToken" model...');
  const config = await getConfig();
  if (config && config.version < 5) {
    doPostUpgrade5 = true;
    logger.warn('Need to add "hash" and "valueIV" column to the "apiToken" table');
    const hash = await sequelize.query(`ALTER TABLE "apiTokens"
        ADD COLUMN "hash" CHAR(${32 * 2});`);
        logger.debug(hash);
    const valueIV = await sequelize.query(`ALTER TABLE "apiTokens"
        ADD COLUMN "valueIV" CHAR(${16 * 2});`);
        logger.debug(valueIV);
    await ServerConfig.update(CONFIG_ID, { config: Object.assign(config, { version: 5 }) });
  }
}

async function upgrade6(sequelize) {
  logger.warn('Checking for update of the "keys" model...');
  await ServerConfig.model.sync();
  const cfg = await ServerConfig.getById(CONFIG_ID);
  if (!cfg) {
    return;
  }

  const config = cfg.getDataValue('config');
  if (config.version < 6) {
    doPostUpgrade3 = true;
    logger.warn('Need to change "privateKeyIV" and "mnemonicEntropyIV" type to handle 24 mnemonics words');
    const privateKey = await sequelize.query(`ALTER TABLE "keys" ALTER COLUMN "privateKey" TYPE VARCHAR;`);
    logger.debug(privateKey);
    const mnemonicEntropy = await sequelize.query(`ALTER TABLE "keys" ALTER COLUMN "mnemonicEntropy" TYPE VARCHAR;`);
    logger.debug(mnemonicEntropy);
    await ServerConfig.update(CONFIG_ID, { config: Object.assign(config, { version: 6 }) });
  }
}

async function upgrade7(sequelize) {
  logger.warn('Checking for update of the "users" model...');
  await ServerConfig.model.sync();
  const cfg = await ServerConfig.getById(CONFIG_ID);
  if (!cfg) {
    return;
  }

  const config = cfg.getDataValue('config');
  if (config.version < 7) {
    logger.warn('Need to add "tokenResetPassword" column to the "users" table');
    const tokenResetPassword = await sequelize.query(`ALTER TABLE "users"
        ADD COLUMN "tokenResetPassword" VARCHAR;`);
        logger.debug(tokenResetPassword);
    await ServerConfig.update(CONFIG_ID, { config: Object.assign(config, { version: 7 }) });
  }
}

async function upgrade8(sequelize) {
  logger.warn('Checking for update of the "keys" model...');
  await ServerConfig.model.sync();
  const cfg = await ServerConfig.getById(CONFIG_ID);
  if (!cfg) {
    return;
  }

  const config = cfg.getDataValue('config');
  if (config.version < 8) {
    doPostUpgrade8 = true;
    logger.warn('Need to add "holder" column to the "key" table');
    const holder = await sequelize.query(`ALTER TABLE "keys"
        ADD COLUMN "holder" VARCHAR;`);
        logger.debug(holder);
        logger.warn('Need to change "mnemonicEntropy" column to the "key" table');
    const mnemonicEntropy = await sequelize.query(`ALTER TABLE "keys"
        ALTER COLUMN "mnemonicEntropy" DROP NOT NULL;`);
        logger.debug(mnemonicEntropy);
        logger.warn('Need to change "mnemonicEntropyIV" column to the "key" table');
    const mnemonicEntropyIV = await sequelize.query(`ALTER TABLE "keys"
        ALTER COLUMN "mnemonicEntropyIV" DROP NOT NULL;`);
        logger.debug(mnemonicEntropyIV);
        logger.warn('Need to change "privateKey" column to the "key" table');
    const privateKey = await sequelize.query(`ALTER TABLE "keys"
        ALTER COLUMN "privateKey" DROP NOT NULL;`);
        logger.debug(privateKey);
        logger.warn('Need to change "privateKeyIV" column to the "key" table');
    const privateKeyIV = await sequelize.query(`ALTER TABLE "keys"
        ALTER COLUMN "privateKeyIV" DROP NOT NULL;`);
        logger.debug(privateKeyIV);
    await ServerConfig.update(CONFIG_ID, { config: Object.assign(config, { version: 8 }) });
  }
}

async function upgrade9(sequelize) {
  logger.warn('Checking for update of the "onboardings" table...');
  await ServerConfig.model.sync();

  let old;
  try {
    old = await sequelize.query(`SELECT *
                                 FROM "onboardings";`);
  } catch {
  }

  if (old) {
    logger.warn('Rename onboardings table to enrollments...');
    const [rename] = await sequelize.query('ALTER TABLE "onboardings" RENAME TO "enrollments";');
  }
}

async function upgrade10(sequelize) {
  logger.warn('Checking for update of the "keys" model...');
  await ServerConfig.model.sync();
  const cfg = await ServerConfig.getById(CONFIG_ID);
  if (!cfg) {
    return;
  }

  const config = cfg.getDataValue('config');
  if (config.version < 10) {
    doPostUpgrade10 = true;
    logger.warn('Need to add "device" column to the "key" table');
    const deviceKey = await sequelize.query(`ALTER TABLE "keys"
        ADD COLUMN "device" VARCHAR;`);
        logger.debug(deviceKey);
    await ServerConfig.update(CONFIG_ID, { config: Object.assign(config, { version: 10 }) });
  }
}

async function upgrade11(sequelize) {
  logger.warn('Checking for update of the "enrollments" model and "serverEvents" type...');
  await ServerConfig.model.sync();
  const cfg = await ServerConfig.getById(CONFIG_ID);
  let enrollmentExist = false;
  if (!cfg) {
    return;
  }
  try {
    await sequelize.query(`SELECT *
                           FROM "enrollments";`);
    enrollmentExist = true;
  } catch {
  }

  const config = cfg.getDataValue('config');
  if (config.version < 11) {
    if (enrollmentExist) {
      logger.warn('Need to add "device" and "name" column to the "enrollments" table');
      const deviceEnroll = await sequelize.query(`ALTER TABLE "enrollments"
          ADD COLUMN "device" VARCHAR;`);
          logger.debug(deviceEnroll);
      const nameEnroll = await sequelize.query(`ALTER TABLE "enrollments"
          ADD COLUMN "name" VARCHAR;`);
          logger.debug(nameEnroll);
    }
    logger.warn('Need to add "enrollment.edit" and "enrollment.delete" type to the "serverEvent" table');
    const deleteEnrollmentServerEvent = await sequelize.query(`ALTER TYPE "enum_serverEvents_type" ADD VALUE 'enrollment.delete';`);
    logger.debug(deleteEnrollmentServerEvent);
    const editEnrollmentServerEvent = await sequelize.query(`ALTER TYPE "enum_serverEvents_type" ADD VALUE 'enrollment.edit';`);
    logger.debug(editEnrollmentServerEvent);
    await ServerConfig.update(CONFIG_ID, { config: Object.assign(config, { version: 11 }) });
  }
}

async function upgrade12(sequelize) {
  logger.warn('Checking for update of the "enrollments" model...');
  await ServerConfig.model.sync();
  const cfg = await ServerConfig.getById(CONFIG_ID);
  if (!cfg) {
    return;
  }

  let enrollmentExist = false;
  try {
    await sequelize.query(`SELECT *
                           FROM "enrollments";`);
    enrollmentExist = true;
  } catch {
  }

  const config = cfg.getDataValue('config');
  if (config.version < 12) {
    if (enrollmentExist) {
      logger.warn('Need to add "signatureRequestId" and "keyExpiration" column to the "enrollments" table');
      const signatureRequestIdEnroll = await sequelize.query(`ALTER TABLE "enrollments"
          ADD COLUMN "signatureRequestId" VARCHAR;`);
      logger.debug(signatureRequestIdEnroll);
      const keyExpiration = await sequelize.query(`ALTER TABLE "enrollments"
          ADD COLUMN "keyExpiration" TIMESTAMPTZ;`);
      logger.debug(keyExpiration);
    }

    const configTCUUpdate: any = config;
    if (configTCUUpdate.TCU) {
      delete configTCUUpdate.TCU;
    }
    await ServerConfig.update(CONFIG_ID, { config: Object.assign(configTCUUpdate, { version: 12 }) });
  }
}

async function upgrade13(sequelize) {
  logger.warn('Checking for update of the "apiTokens" model...');
  await ServerConfig.model.sync();
  const cfg = await ServerConfig.getById(CONFIG_ID);
  if (!cfg) {
    return;
  }

  const config = cfg.getDataValue('config');
  if (config.version < 13) {
    logger.warn('Need to add "userId" column to the "apiToken" table');
    const userId = await sequelize.query(`ALTER TABLE "apiTokens"
        ADD COLUMN "userId" UUID;`);
    logger.debug(userId);
    await ServerConfig.update(CONFIG_ID, { config: Object.assign(config, { version: 13 }) });
  }
}

async function upgrade14(sequelize) {
  logger.warn('Checking for update of the "keys" model...');
  await ServerConfig.model.sync();
  const cfg = await ServerConfig.getById(CONFIG_ID);
  if (!cfg) {
    return;
  }
  const config = cfg.getDataValue('config');
  if (config.version < 14) {
    logger.warn('Need to add "signatureRequestId" and "keyExpiration" column to the "enrollments" table');
    const editKeysStatusEvent = await sequelize.query(`ALTER TYPE "enum_keys_status" ADD VALUE 'revoked';`);
    logger.debug(editKeysStatusEvent);
    const keyRevokedAt = await sequelize.query(`ALTER TABLE "keys"
        ADD COLUMN "revokedAt" TIMESTAMPTZ;`);
    logger.debug(keyRevokedAt);
    await ServerConfig.update(CONFIG_ID, { config: Object.assign(config, { version: 14 }) });
  }
}

async function upgrade15(sequelize) {
  logger.warn('Checking for update of the "users" model...');
  await ServerConfig.model.sync();
  const cfg = await ServerConfig.getById(CONFIG_ID);
  if (!cfg) {
    return;
  }

  const config = cfg.getDataValue('config');
  if (config.version < 15) {
    logger.warn('Need to add the mode enum in "users" table');
    const enum_users_type = await sequelize.query(`CREATE TYPE "enum_users_mode" AS ENUM ('seal', 'esign');`);
    logger.debug(enum_users_type);
    logger.warn('Need to add "type" column to the "users" table');
    const users_type = await sequelize.query(`ALTER TABLE "users"
        ADD COLUMN "mode" enum_users_mode;`);
    logger.debug(users_type);
    await ServerConfig.update(CONFIG_ID, { config: Object.assign(config, { version: 15 }) });
    await Key.model.sync();
    const users = await User.model.findAll();

    logger.warn(`${users.length} users to update...`);

    for (const user of users) {
      logger.warn(`Updating key ${user.get('id')} ...`);
      user.set('mode', 'seal');
      await user.save();
      logger.debug(`Updated key ${user.get('id')}`);
    }
  }
}

async function upgrade16(sequelize) {
  logger.warn('Checking for update of the "users" model...');
  await ServerConfig.model.sync();
  const cfg = await ServerConfig.getById(CONFIG_ID);
  if (!cfg) {
    return;
  }

  const config = cfg.getDataValue('config');
  if (config.version < 16) {
    logger.warn('Need to add "manager" enums to the "enum_users_role" table');
    const userManager = await sequelize.query(`ALTER TYPE "enum_users_role" ADD VALUE 'manager';`);
    logger.debug(userManager);
    await ServerConfig.update(CONFIG_ID, { config: Object.assign(config, { version: 16 }) });
  }
}

async function upgrade17(sequelize) {
  await ServerConfig.model.sync();
  const cfg = await ServerConfig.getById(CONFIG_ID);
  if (!cfg) {
    return;
  }

  const config = cfg.getDataValue('config');
  if (config.version < 17) {
    logger.warn('Removing old OIDCP caches tables');

    const tablesToDrop = [
      'Sessions',
      'AccessTokens',
      'AuthorizationCodes',
      'RefreshTokens',
      'DeviceCodes',
      'ClientCredentials',
      'Clients',
      'InitialAccessTokens',
      'RegistrationAccessTokens'];

    tablesToDrop.forEach(async tableToDrop => {
      const dropLogs = await sequelize.query(`DROP TABLE IF EXISTS "${tableToDrop}";`);
      logger.warn(`Dropping table ${tableToDrop} if it exists`, dropLogs);
    });

    if ((config as any).OIDCPInterfaceURL) {
      logger.warn('Cleaning OIDCPInterfaceURL configuration data');
      delete (config as any).OIDCPInterfaceURL;
    }

    if ((config as any).OIDCPIssuerURL) {
      logger.warn('Cleaning OIDCPIssuerURL configuration data');
      delete (config as any).OIDCPIssuerURL;
    }

    await ServerConfig.update(CONFIG_ID, { config: Object.assign(config, { version: 17 }) });
  }
}

export async function upgrade(sequelize: Sequelize) {
  await upgrade1(sequelize);
  await upgrade2(sequelize);
  await upgrade3(sequelize);
  await upgrade4(sequelize);
  await upgrade5(sequelize);
  await upgrade6(sequelize);
  await upgrade7(sequelize);
  await upgrade8(sequelize);
  await upgrade9(sequelize);
  await upgrade10(sequelize);
  await upgrade11(sequelize);
  await upgrade12(sequelize);
  await upgrade13(sequelize);
  await upgrade14(sequelize);
  await upgrade15(sequelize);
  await upgrade16(sequelize);
  await upgrade17(sequelize);
}

async function postUpgrade3() {
  logger.warn('Checking for post-update of the "keys" model...');

  if (doPostUpgrade3 === true) {
    await Key.model.sync();
    const testKey = await Key.model.findOne();

    if (!testKey) {
      logger.warn(`No key to update`);
      return;
    }

    logger.warn('Need to re-encrypt keys, we will ask you to enter your encryption secret (again) if not set as environment variable');

    let secret = process.env[secretEnvVariableName] || '';

    if (!secret) {
      logger.warn(`No ${secretEnvVariableName} environment set, please enter encryption secret:`);
      const options = { prompt: '>', silent: true };
      const _read = promisify(read);
      while (!secret) {
        secret = await _read(options);
        if (!secret) {
          logger.warn('Encryption secret must not be empty, please type it:');
        }
      }
    }

    const _secret = crypto.createHash('sha256')
      .update(secret, 'utf8')
      .digest();

    logger.warn('Checking that the secret is correct...');

    function decrypt(data: Buffer) {
      const decipher = crypto.createDecipher('aes-256-cbc', _secret);
      return Buffer.concat([decipher.update(data), decipher.final()]);
    }

    try {
      decrypt(Buffer.from(testKey.getDataValue('privateKey'), 'hex'));
    } catch (err) {
      logger.error('Cannot decrypt key! Please check that the secret is correct and try again');
      throw new Error('Cannot decrypt key');
    }

    logger.warn('Secret is corretcly set, re-encypting all keys');

    const keys = await Key.model.findAll();

    logger.warn(`${keys.length} keys to update...`);

    for (const key of keys) {
      logger.warn(`Updating key ${key.get('id')} ...`);
      {
        const p = decrypt(Buffer.from(key.getDataValue('privateKey'), 'hex'));
        const { data, iv } = await secureModule.encrypt(p);
        key.set('privateKeyIV', iv.toString('hex'));
        key.set('privateKey', data.toString('hex'));
      }
      {
        const e = decrypt(Buffer.from(key.getDataValue('mnemonicEntropy'), 'hex'));
        const { data, iv } = await secureModule.encrypt(e);
        key.set('mnemonicEntropyIV', iv.toString('hex'));
        key.set('mnemonicEntropy', data.toString('hex'));
      }
      await key.save();
      logger.debug(`Updated key ${key.get('id')}`);
    }
  }
}

async function postUpgrade8() {

  if (doPostUpgrade8 === true) {
    await Key.model.sync();
    const keys = await Key.model.findAll();

    logger.warn(`${keys.length} keys to update...`);

    for (const key of keys) {
      logger.warn(`Updating key ${key.get('id')} ...`);
      {
        key.set('holder', 'server');
      }
      await key.save();
      logger.debug(`Updated key ${key.get('id')}`);
    }
  }
}

async function postUpgrade10() {

  if (doPostUpgrade10 === true) {
    await Key.model.sync();
    const keys = await Key.model.findAll();

    logger.warn(`${keys.length} keys to update...`);

    for (const key of keys) {
      logger.warn(`Updating key ${key.get('id')} ...`);
      if (key.get('holder') === 'server') {
        key.set('device', 'server');
      }
      await key.save();
      logger.debug(`Updated key ${key.get('id')}`);
    }
  }
}

async function afterInitUpgrade5() {
  logger.warn('Checking for after-init-update of the "apiToken" model...');

  if (doPostUpgrade5 === true) {
    await APIToken.model.sync();
    const testToken = await APIToken.model.findOne();

    if (!testToken) {
      logger.warn(`No token to update`);
      return;
    }

    logger.warn('Need to encrypt tokens');

    const tokens = await APIToken.model.findAll();

    logger.warn(`${tokens.length} tokens to update...`);

    for (const token of tokens) {
      logger.warn(`Updating token ${token.get('id')} ...`);
      {
        const bin = Buffer.from(token.getDataValue('value'), 'base64');
        const hash = crypto.createHash('sha256').update(bin).digest('hex');
        const { data, iv } = await secureModule.encrypt(bin);
        token.set('hash', hash);
        token.set('value', data.toString('hex'));
        token.set('valueIV', iv.toString('hex'));
      }
      await token.save();
      logger.debug(`Updated token ${token.get('id')}`);
    }
  }
}

/**
 * Upgrade function called when secure module is initialized
 */
export async function postUpgrade(sequelize: Sequelize) {
  await postUpgrade3();
  await postUpgrade8();
  await postUpgrade10();
}

/**
 * Upgrade function called when secure module is initialized and secret validated
 */
export async function afterInitUpgrade(sequelize: Sequelize) {
  await afterInitUpgrade5();
}
