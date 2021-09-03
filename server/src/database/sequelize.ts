import { Sequelize, Options } from 'sequelize';
import { db } from '../config';

const DATABASE = db.database;
const PASSWORD = db.password;
const USERNAME = db.username;

const options: Options = {
  dialect: 'postgres',
  host: db.host,
  port: db.port,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },

  logging: false
};

export const sequelize = new Sequelize(DATABASE, USERNAME, PASSWORD, options);
