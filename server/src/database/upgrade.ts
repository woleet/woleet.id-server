import { Sequelize } from 'sequelize';
import * as log from 'loglevel';
import { ServerConfig } from '.';
import { serverConfig } from '../config';

export async function upgrade(sequelize: Sequelize) {
  let old;
  try {
    const [model] = await sequelize.query(`SELECT * FROM "ServerConfigs" AS config WHERE config.id = '${serverConfig.CONFIG_ID}';`);
    old = model[0];
  } catch {

  }

  if (old) {
    log.warn(`Need to upgrade configuration model...`);
    log.warn(`Old model value is`, JSON.stringify(old, null, 2));
    const config = Object.assign({}, old);
    delete config.id;
    delete config.createdAt;
    delete config.updatedAt;

    await ServerConfig.model.sync();

    log.warn(`Copying old configuration to new table...`);
    const { createdAt, updatedAt } = old;
    await ServerConfig.create({ config, createdAt, updatedAt });

    log.warn(`Drop old configuration table...`);
    const [drop] = await sequelize.query(`Drop TABLE "ServerConfigs";`);

    log.warn(`Drop succeed!`, drop);
  } else {
    log.info(`Database model is up to date!`);
  }
}
