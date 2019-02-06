import { Sequelize } from 'sequelize';
import * as log from 'loglevel';
import * as read from 'read';
import * as crypto from 'crypto';
import { ServerConfig, Key } from '.';
import { serverConfig, secretEnvVariableName, secureModule } from '../config';
import { promisify } from 'util';

const { CONFIG_ID } = serverConfig;
let doPostUpgrade3 = false;

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
  await ServerConfig.model.sync();
  const cfg = await ServerConfig.getById(CONFIG_ID);
  if (!cfg) {
    return;
  }

  const { config } = cfg.toJSON();
  if (!config.version) {
    log.warn('Need to add "expiration" column to the "keys" table');
    const res = await sequelize.query(`ALTER TABLE "keys" ADD COLUMN expiration TIMESTAMP WITH TIME ZONE;`);
    log.debug(res);
    await ServerConfig.update(CONFIG_ID, { config: Object.assign({ version: 1 }, config) });
  }
}

async function upgrade3(sequelize) {
  log.warn('Checking for update 2 of the "keys" model...');
  await ServerConfig.model.sync();
  const cfg = await ServerConfig.getById(CONFIG_ID);
  if (!cfg) {
    return;
  }

  const { config } = cfg.toJSON();
  if (config.version < 2) {
    doPostUpgrade3 = true;
    log.warn('Need to add "privateKeyIV" and "mnemonicEntropyIV" column to the "keys" table');
    const privateKeyIV = await sequelize.query(`ALTER TABLE "keys" ADD COLUMN "privateKeyIV" CHAR (${16 * 2});`);
    log.debug(privateKeyIV);
    const mnemonicEntropyIV = await sequelize.query(`ALTER TABLE "keys" ADD COLUMN "mnemonicEntropyIV" CHAR (${16 * 2});`);
    log.debug(mnemonicEntropyIV);
    await ServerConfig.update(CONFIG_ID, { config: Object.assign(config, { version: 2 }) });
  }
}

async function upgrade4(sequelize) {
  log.warn('Checking for update of the "user" model...');
  await ServerConfig.model.sync();
  const cfg = await ServerConfig.getById(CONFIG_ID);
  if (!cfg) {
    return;
  }

  const { config } = cfg.toJSON();
  if (config.version < 4) {
    log.warn('Need to add "phone" and "countryCallingCode" column to the "users" table');
    const phone = await sequelize.query(`ALTER TABLE "users" ADD COLUMN "phone" VARCHAR;`);
    log.debug(phone);
    const countryCallingCode = await sequelize.query(`ALTER TABLE "users" ADD COLUMN "countryCallingCode" VARCHAR;`);
    log.debug(countryCallingCode);
    await ServerConfig.update(CONFIG_ID, { config: Object.assign(config, { version: 4 }) });
  }
}

export async function upgrade(sequelize: Sequelize) {
  await upgrade1(sequelize);
  await upgrade2(sequelize);
  await upgrade3(sequelize);
  await upgrade4(sequelize);
}

async function postUpgrade3(sequelize) {
  log.warn('Checking for post-update 2 of the "keys" model...');
  await ServerConfig.model.sync();
  const cfg = await ServerConfig.getById(CONFIG_ID);
  if (!cfg) {
    return;
  }

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
      const p = decrypt(Buffer.from(testKey.get('privateKey'), 'hex'));
      const e = decrypt(Buffer.from(testKey.get('mnemonicEntropy'), 'hex'));
      {
        const { data, iv } = await secureModule.encrypt(p);
        key.set('privateKeyIV', iv.toString('hex'));
        key.set('privateKey', data.toString('hex'));
      }
      {
        const { data, iv } = await secureModule.encrypt(e);
        key.set('mnemonicEntropyIV', iv.toString('hex'));
        key.set('mnemonicEntropy', data.toString('hex'));
      }
      await key.save();
      log.debug(`Updated key ${key.get('id')}`);
    }
  }
}

/**
 * Upgrade function called when secure module is initialized
 */
export async function postUpgrade(sequelize: Sequelize) {
  await postUpgrade3(sequelize);
}
