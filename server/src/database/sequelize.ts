import * as Sequelize from 'sequelize';

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

export const sequelize = new Sequelize(DATABASE, USERNAME, PASSWORD, options);
