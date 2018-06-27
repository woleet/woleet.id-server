import * as Sequelize from 'sequelize';
import * as Debug from 'debug';
import { UserAccess } from './model/user';
import { KeyAccess } from './model/key';

const debug = Debug('id:db');

const DATABASE = 'wid';
const PASSWORD = 'pass';
const USERNAME = 'pguser';

const options = {
  dialect: 'postgres',
  host: 'localhost',
  port: 5432,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },

  logging: false,
  operatorsAliases: false
};

const client = new Sequelize(DATABASE, USERNAME, PASSWORD, options);

const User = new UserAccess(client);
const Key = new KeyAccess(client, User.model);

const db = { User, Key };

// Connection
(async () => {
  debug('Connecting to database...');
  await client.authenticate();

  debug('Connected to database.');
  debug('Synchronizing user model...');
  await User.client.drop();
  await Key.client.drop();
  await User.client.sync();
  await Key.client.sync();
  debug('Synchronized user model.');
  debug('Ready.');
})().catch((err) => {
  console.error(err);
  process.exit(1);
});

export { db };
