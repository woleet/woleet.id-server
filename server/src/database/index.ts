import { sequelize } from './sequelize';
import * as Debug from 'debug';
import { APIKey } from './model/api-key';
import { User } from './model/user';
import { Key } from './model/key';

const debug = Debug('id:db');

User.model.hasMany(Key.model, { onDelete: 'cascade', hooks: true });

User.model.belongsTo(Key.model, { as: 'defaultKey', constraints: false, hooks: true });

User.model.removeAttribute
Key.model.belongsTo(User.model, { foreignKey: { allowNull: false } });

Key.model.beforeDelete(async (key) => {
  debug(`delete key ${key.get('id')}`);
  const keyId: string = key.getDataValue('id');
  const userId: string = key.getDataValue('userId');
  const where = { defaultKeyId: keyId };
  const user = await User.model.findById(userId, { where });

  if (!user)
    return;

  user.setDataValue('defaultKeyId', null);

  debug('updated user', user.toJSON());

  await user.save();
})

export { User, Key, APIKey };

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
