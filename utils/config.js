require('dotenv').config();

const { NODE_ENV, PORT, DB } = process.env;

const PORT_CONFIG = NODE_ENV === 'production' ? PORT : 3000;
const DB_CONFIG = NODE_ENV === 'production' ? DB : 'mongodb://127.0.0.1:27017/bitfilmsdb';

module.exports = {
  PORT_CONFIG,
  DB_CONFIG,
};
