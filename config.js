const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  dbUser: process.env.DATABASE_USER,
  dbPort: process.env.DATABASE_PORT,
  dbPassword: process.env.DATABASE_PASSWORD,
  db: process.env.DATABASE,
};