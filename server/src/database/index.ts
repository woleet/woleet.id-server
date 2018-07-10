import { sequelize } from './sequelize';
import * as Debug from 'debug';
import { User } from './model/user';
import { Key } from './model/key';
import { encode } from '../controllers/utils/password';

const debug = Debug('id:db');

export const db = { User, Key };

// Connection
(async () => {
  debug('Connecting to database...');
  await sequelize.authenticate();

  debug('Connected to database.');
  debug('Synchronizing user model...');
  await User.client.drop();
  // await Key.client.drop();
  await User.client.sync();
  await Key.client.sync();
  debug('Synchronized user model.');
  debug('Creating admin user');
  const { hash: passwordHash, salt: passwordSalt, iterations: passwordItrs } = await encode('pass');
  const admin = {
    username: 'admin', firstName: '', lastName: '',
    passwordHash, passwordSalt, passwordItrs
  };
  User.create(Object.assign(admin, { type: 'admin' }))
    .catch((err) => console.error(err.message))
  debug('Created admin user');
  debug('Ready.');
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
