import dotenv from 'dotenv';

dotenv.config();

module.exports = {
  user: process.env.POSTGRES_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.DATABASE_PORT,
};
