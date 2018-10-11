import { sequelize } from './sequelize';
import * as Debug from 'debug';
import { APIToken } from './model/api-token';
import { ServerEvent } from './model/server-event';
import { ServerConfig } from './model/server-config';
import { User } from './model/user';
import { Key } from './model/key';
import { getServerConfig, setServerConfig } from '../controllers/server-config';

const debug = Debug('id:db');

User.model.hasMany(Key.model, { onDelete: 'cascade', hooks: true });

User.model.belongsTo(Key.model, { as: 'defaultKey', constraints: false, hooks: true });

Key.model.belongsTo(User.model, { foreignKey: { allowNull: false } });

Key.model.beforeDelete(async (key) => {
  debug(`delete key ${key.get('id')}`);
  const keyId: string = key.getDataValue('id');
  const userId: string = key.getDataValue('userId');
  const where = { defaultKeyId: keyId };
  const user = await User.model.findById(userId, { where });

  const config = getServerConfig();

  if (config.defaultKeyId === keyId) {
    await setServerConfig({ defaultKeyId: null });
  }

  if (!user) {
    return;
  }

  user.setDataValue('defaultKeyId', null);

  debug('updated user', user.toJSON());

  await user.save();
});

ServerConfig.model.belongsTo(Key.model, { as: 'defaultKey' });

export { User, Key, APIToken, ServerEvent, ServerConfig };

// Connection
(async () => {
  debug('Connecting to database...');
  await sequelize.authenticate();
  debug('Connected to database.');
  debug('Synchronizing db model...');
  await sequelize.sync(/* { force: true } */);
  debug('Synchronized db model.');
  debug('Ready.');
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
