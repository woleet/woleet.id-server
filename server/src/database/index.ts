import { sequelize } from './sequelize';
import * as Debug from 'debug';
import { APIKey } from './model/api-key';
import { User } from './model/user';
import { Key } from './model/key';

const debug = Debug('id:db');

User.model.hasMany(Key.model, { onDelete: 'cascade', hooks: true })

User.model.belongsTo(Key.model, { as: 'defaultKey', constraints: false })

Key.model.belongsTo(User.model, { foreignKey: { allowNull: false } });

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
