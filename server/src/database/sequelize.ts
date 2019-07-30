import * as Sequelize from 'sequelize';
import { db } from '../config';

const DATABASE = db.database;
const PASSWORD = db.password;
const USERNAME = db.username;

const options = {
  dialect: 'postgres',
  host: db.host,
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

export const sequelize = new Sequelize(DATABASE, USERNAME, PASSWORD, options);
