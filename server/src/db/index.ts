import * as Sequelize from 'sequelize';
import * as Debug from 'debug';

import { userModel, UserAccess } from './model/user';
import { SequelizeUserObject, ApiPostUserObject, Dictionary } from '../typings';
import { AbstractInstanceAccess } from './abstract';

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

  logging: false
};

const client = new Sequelize(DATABASE, USERNAME, PASSWORD, options);

const db = {
  user: new UserAccess(client)
};

// Connection
(async () => {
  debug('Connecting to database...');
  await client.authenticate();
  debug('Connected to database.');
  debug('Synchronizing user model...');
  Object
    .keys(db)
    .map((n): { client: Sequelize.Model<any, any> } => db[n])
    .forEach(({ client }) => client.sync({ force: true }));
  debug('Synchronized user model.');
  debug('Ready.');
})().catch((err) => {
  console.error(err);
  process.exit(1);
});

export { db };
