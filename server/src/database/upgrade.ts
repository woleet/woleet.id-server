import { Sequelize } from 'sequelize';
import * as log from 'loglevel';
import { ServerConfig } from '.';
import { serverConfig } from '../config';

const { CONFIG_ID } = serverConfig;

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
    const res = await sequelize.query(`ALTER TABLE "keys" ADD COLUMN expiration DATE;`);
    log.info(res);
    await ServerConfig.update(CONFIG_ID, { config: Object.assign({ version: 1 }, config) });
  }
}

export async function upgrade(sequelize: Sequelize) {
  await upgrade1(sequelize);
  await upgrade2(sequelize);
}
