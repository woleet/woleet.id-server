import { UserObject } from '../typings';

import * as Sequelize from 'sequelize';

import * as Debug from 'debug';
const debug = Debug('id:db');

const USERNAME = 'pguser';
const PASSWORD = 'pass';
const DATABASE = 'wid';

const options = {
  dialect: 'postgres',
  host: 'localhost',
  port: 5432,
  logging: Debug('id:db:core')
};

class DB {

  client: Sequelize.Sequelize;

  constructor() {
    this.client = new Sequelize(DATABASE, USERNAME, PASSWORD, options);
    this.init();
  }

  private async connect() {
    debug('Connecting to database.')
    await this.client.authenticate();
    debug('Connected to database.')
  }

  private async init() {
    debug('Initializing database.');
    try {
      await this.connect();
    } catch (err) {
      console.error(err);
    }
  }

  async createUser(user: UserObject) {
    debug('Create user', user);
  }

}

const db = new DB;

export { db };
