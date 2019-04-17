import { Sequelize } from 'sequelize';
import * as log from 'loglevel';
import * as read from 'read';
import * as crypto from 'crypto';
import { ServerConfig, Key, APIToken } from '.';
import { serverConfig, secretEnvVariableName, secureModule } from '../config';
import { promisify } from 'util';

const { CONFIG_ID } = serverConfig;
let doPostUpgrade3 = false;
let doPostUpgrade5 = false;
let doPostUpgrade8 = false;

async function getConfig() {
  await ServerConfig.model.sync();
  const config = await ServerConfig.getById(CONFIG_ID);
  if (!config) {
    return;
  }
  return config.toJSON().config;
}

async function upgrade1(sequelize) {
  log.warn('Checking for update of the configuration model...');
  let old;
  try {
    const [model] = await sequelize.query(`SELECT * FROM "ServerConfigs" AS config WHERE config.id = '${serverConfig.CONFIG_ID}';`);
    old = model[0];
  } catch {

  }

  if (old) {
    log.warn('Need to upgrade configuration model...');
    log.warn('Old model value is', JSON.stringify(old, null, 2));
    const config = Object.assign({}, old);
    delete config.id;
    delete config.createdAt;
    delete config.updatedAt;

    await ServerConfig.model.sync();

    log.warn('Copying old configuration to new table...');
    const { createdAt, updatedAt } = old;
    await ServerConfig.create({ config, createdAt, updatedAt });

    log.warn('Dropping old configuration table...');
    const [drop] = await sequelize.query('Drop TABLE "ServerConfigs";');
  }
}

async function upgrade2(sequelize) {
  log.warn('Checking for update of the "keys" model...');
  const config = await getConfig();
  if (config && !config.version) {
    log.warn('Need to add "expiration" column to the "keys" table');
    const res = await sequelize.query(`ALTER TABLE "keys" ADD COLUMN expiration TIMESTAMP WITH TIME ZONE;`);
    log.debug(res);
    await ServerConfig.update(CONFIG_ID, { config: Object.assign({ version: 1 }, config) });
  }
}

async function upgrade3(sequelize) {
  log.warn('Checking for update 2 of the "keys" model...');

  const config = await getConfig();
  if (config && config.version < 2) {
    doPostUpgrade3 = true;
    log.warn('Need to add "privateKeyIV" and "mnemonicEntropyIV" column to the "keys" table');
    const privateKeyIV = await sequelize.query(`ALTER TABLE "keys" ADD COLUMN "privateKeyIV" CHAR(${16 * 2});`);
    log.debug(privateKeyIV);
    const mnemonicEntropyIV = await sequelize.query(`ALTER TABLE "keys" ADD COLUMN "mnemonicEntropyIV" CHAR (${16 * 2});`);
    log.debug(mnemonicEntropyIV);
    await ServerConfig.update(CONFIG_ID, { config: Object.assign(config, { version: 2 }) });
  }
}

async function upgrade4(sequelize) {
  log.warn('Checking for update of the "user" model...');

  const config = await getConfig();
  if (config && config.version < 4) {
    log.warn('Need to add "phone" and "countryCallingCode" column to the "users" table');
    const phone = await sequelize.query(`ALTER TABLE "users" ADD COLUMN "phone" VARCHAR;`);
    log.debug(phone);
    const countryCallingCode = await sequelize.query(`ALTER TABLE "users" ADD COLUMN "countryCallingCode" VARCHAR;`);
    log.debug(countryCallingCode);
    await ServerConfig.update(CONFIG_ID, { config: Object.assign(config, { version: 4 }) });
  }
}

async function upgrade5(sequelize) {
  log.warn('Checking for update of the "apiToken" model...');

  const config = await getConfig();
  if (config && config.version < 5) {
    doPostUpgrade5 = true;
    log.warn('Need to add "hash" and "valueIV" column to the "apiToken" table');
    const hash = await sequelize.query(`ALTER TABLE "apiTokens" ADD COLUMN "hash" CHAR(${32 * 2});`);
    log.debug(hash);
    const valueIV = await sequelize.query(`ALTER TABLE "apiTokens" ADD COLUMN "valueIV" CHAR(${16 * 2});`);
    log.debug(valueIV);
    await ServerConfig.update(CONFIG_ID, { config: Object.assign(config, { version: 5 }) });
  }
}

async function upgrade6(sequelize) {
  log.warn('Checking for update 3 of the "keys" model...');
  await ServerConfig.model.sync();
  const cfg = await ServerConfig.getById(CONFIG_ID);
  if (!cfg) {
    return;
  }

  const { config } = cfg.toJSON();
  if (config.version < 6) {
    doPostUpgrade3 = true;
    log.warn('Need to change "privateKeyIV" and "mnemonicEntropyIV" type to handle 24 mnemonics words');
    const privateKey = await sequelize.query(`ALTER TABLE "keys" ALTER COLUMN "privateKey" TYPE VARCHAR;`);
    log.debug(privateKey);
    const mnemonicEntropy = await sequelize.query(`ALTER TABLE "keys" ALTER COLUMN "mnemonicEntropy" TYPE VARCHAR;`);
    log.debug(mnemonicEntropy);
    await ServerConfig.update(CONFIG_ID, { config: Object.assign(config, { version: 6 }) });
  }
}

async function upgrade7(sequelize) {
  log.warn('Checking for update 2 of the "users" model...');
  await ServerConfig.model.sync();
  const cfg = await ServerConfig.getById(CONFIG_ID);
  if (!cfg) {
    return;
  }

  const { config } = cfg.toJSON();
  log.info({ config });
  if (config.version < 7) {
    log.warn('Need to add "tokenResetPassword" column to the "users" table');
    const tokenResetPassword = await sequelize.query(`ALTER TABLE "users" ADD COLUMN "tokenResetPassword" VARCHAR;`);
    log.debug(tokenResetPassword);
    await ServerConfig.update(CONFIG_ID, { config: Object.assign(config, { version: 7 }) });
  }
}

async function upgrade8(sequelize) {
  log.warn('Checking for update 4 of the "keys" model...');
  await ServerConfig.model.sync();
  const cfg = await ServerConfig.getById(CONFIG_ID);
  if (!cfg) {
    return;
  }

  const { config } = cfg.toJSON();
  if (config.version < 8) {
    doPostUpgrade8 = true;
    log.warn('Need to add "holder" column to the "key" table');
    const holder = await sequelize.query(`ALTER TABLE "keys" ADD COLUMN "holder" VARCHAR;`);
    log.debug(holder);
    log.warn('Need to change "mnemonicEntropy" column to the "key" table');
    const mnemonicEntropy = await sequelize.query(`ALTER TABLE "keys" ALTER COLUMN "mnemonicEntropy" VARCHAR NULL;`);
    log.debug(mnemonicEntropy);
    log.warn('Need to change "mnemonicEntropyIV" column to the "key" table');
    const mnemonicEntropyIV = await sequelize.query(`ALTER TABLE "keys" ALTER COLUMN "mnemonicEntropyIV" CHAR(${16 * 2}) NULL;`);
    log.debug(mnemonicEntropyIV);
    log.warn('Need to change "privateKey" column to the "key" table');
    const privateKey = await sequelize.query(`ALTER TABLE "keys" ALTER COLUMN "privateKey" VARCHAR NULL;`);
    log.debug(privateKey);
    log.warn('Need to change "privateKeyIV" column to the "key" table');
    const privateKeyIV = await sequelize.query(`ALTER TABLE "keys" ALTER COLUMN "privateKeyIV" CHAR(${16 * 2}) NULL;`);
    log.debug(privateKeyIV);
    await ServerConfig.update(CONFIG_ID, { config: Object.assign(config, { version: 8 }) });
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
}

async function postUpgrade3() {
  log.warn('Checking for post-update 2 of the "keys" model...');

  if (doPostUpgrade3 === true) {
    await Key.model.sync();
    const testKey = await Key.model.findOne({ paranoid: false });

    if (!testKey) {
      log.warn(`No key to update`);
      return;
    }

    log.warn('Need to re-encrypt keys, we will ask you to enter your encryption secret (again) if not set as environment variable.');

    let secret = process.env[secretEnvVariableName] || '';

    if (!secret) {
      log.warn(`No ${secretEnvVariableName} environment set, please enter encryption secret:`);
      const options = { prompt: '>', silent: true };
      const _read = promisify(read);
      while (!secret) {
        secret = await _read(options);
        if (!secret) {
          log.warn('Encryption secret must not be empty, please type it:');
        }
      }
    }

    const _secret = crypto.createHash('sha256')
      .update(secret, 'utf8')
      .digest();

    log.warn('Checking that the secret is correct...');

    function decrypt(data: Buffer) {
      const decipher = crypto.createDecipher('aes-256-cbc', _secret);
      return Buffer.concat([decipher.update(data), decipher.final()]);
    }

    try {
      decrypt(Buffer.from(testKey.get('privateKey'), 'hex'));
    } catch (err) {
      log.error('Failed to decrypt key! Please check that the secret is correct and try again.');
      throw new Error('Failed to decrypt key');
    }

    log.warn('Secret is corretcly set, re-encypting all keys.');

    const keys = await Key.model.findAll({ paranoid: false });

    log.warn(`${keys.length} keys to update...`);

    for (const key of keys) {
      log.warn(`Updating key ${key.get('id')} ...`);
      {
        const p = decrypt(Buffer.from(key.get('privateKey'), 'hex'));
        const { data, iv } = await secureModule.encrypt(p);
        key.set('privateKeyIV', iv.toString('hex'));
        key.set('privateKey', data.toString('hex'));
      }
      {
        const e = decrypt(Buffer.from(key.get('mnemonicEntropy'), 'hex'));
        const { data, iv } = await secureModule.encrypt(e);
        key.set('mnemonicEntropyIV', iv.toString('hex'));
        key.set('mnemonicEntropy', data.toString('hex'));
      }
      await key.save();
      log.debug(`Updated key ${key.get('id')}`);
    }
  }
}

async function postUpgrade8() {
  log.warn('');

  if (doPostUpgrade8 === true) {
    await Key.model.sync();
    const keys = await Key.model.findAll({ paranoid: false });

    log.warn(`${keys.length} keys to update...`);

    for (const key of keys) {
      log.warn(`Updating key ${key.get('id')} ...`);
      {
        key.set('holder', 'server');
      }
      await key.save();
      log.debug(`Updated key ${key.get('id')}`);
    }
  }
}

async function afterInitUpgrade5() {
  log.warn('Checking for after-init-update of the "apiToken" model...');

  if (doPostUpgrade5 === true) {
    await APIToken.model.sync();
    const testToken = await APIToken.model.findOne({ paranoid: false });

    if (!testToken) {
      log.warn(`No token to update`);
      return;
    }

    log.warn('Need to encrypt tokens.');

    const tokens = await APIToken.model.findAll({ paranoid: false });

    log.warn(`${tokens.length} tokens to update...`);

    for (const token of tokens) {
      log.warn(`Updating token ${token.get('id')} ...`);
      {
        const bin = Buffer.from(token.get('value'), 'base64');
        const hash = crypto.createHash('sha256').update(bin).digest('hex');
        const { data, iv } = await secureModule.encrypt(bin);
        token.set('hash', hash);
        token.set('value', data.toString('hex'));
        token.set('valueIV', iv.toString('hex'));
      }
      await token.save();
      log.debug(`Updated token ${token.get('id')}`);
    }
  }
}

/**
 * Upgrade function called when secure module is initialized
 */
export async function postUpgrade(sequelize: Sequelize) {
  await postUpgrade3();
  await postUpgrade8();
}

/**
 * Upgrade function called when secure module is initialized and secret validated
 */
export async function afterInitUpgrade(sequelize: Sequelize) {
  await afterInitUpgrade5();
}
