import { ConnectionError } from 'sequelize';
import { sequelize } from './sequelize';
import * as Debug from 'debug';
import { APIToken } from './model/api-token';
import { ServerEvent } from './model/server-event';
import { ServerConfig } from './model/server-config';
import { User } from './model/user';
import { Key } from './model/key';
import { Enrollment } from './model/enrollment';
import { getServerConfig, setServerConfig } from '../controllers/server-config';
import { afterInitUpgrade, postUpgrade, upgrade } from './upgrade';
import { db } from '../config';
import * as log from 'loglevel';
import wait from '../controllers/utils/wait';

const debug = Debug('id:db');

User.model.hasMany(Key.model, { onDelete: 'cascade', hooks: true });

User.model.hasMany(Enrollment.model, { onDelete: 'cascade', hooks: true });

User.model.belongsTo(Key.model, { as: 'defaultKey', constraints: false, hooks: true });

Key.model.belongsTo(User.model, { foreignKey: { allowNull: false } });

Enrollment.model.belongsTo(User.model, { foreignKey: { allowNull: false } });

Key.model.beforeDelete(async (key) => {
  debug(`delete key ${key.get('id')}`);
  const keyId: string = key.getDataValue('id');
  const userId: string = key.getDataValue('userId');
  const user = await User.model.findById(userId);

  const config = getServerConfig();

  if (config.defaultKeyId === keyId) {
    await setServerConfig({ defaultKeyId: null });
  }

  if (user.getDataValue('defaultKeyId') !== keyId) {
    return;
  }

  user.setDataValue('defaultKeyId', null);

  debug('updated user', user.toJSON());

  await user.save();
});

export { User, Key, APIToken, ServerEvent, ServerConfig, Enrollment };

export async function init() {
  let attempts = db.connectionAttempts;
  while (attempts--) {
    try {
      debug('Connecting to database...');
      await sequelize.authenticate();
      debug('Connected to database');

      await upgrade(sequelize);

      debug('Synchronizing db model...');
      await sequelize.sync(/* { force: true } */);
      debug('Synchronized db model');
      debug('Ready');
      return;
    } catch (err) {
      if (attempts && err instanceof ConnectionError) {
        log.warn(`Failed to connect to database, retrying in ${db.retryDelay}ms`);
        await wait(db.retryDelay);
        continue;
      }
      throw err;
    }
  }
}

/**
 * Upgrade function called when secure module is initialized
 */
export async function postinit() {
  await postUpgrade(sequelize);
}

/**
 * Upgrade function called when secure module is initialized and secret validated
 */
export async function afterinit() {
  await afterInitUpgrade(sequelize);
}
