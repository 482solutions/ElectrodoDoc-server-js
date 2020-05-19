import pg from 'pg';
import configDB from './configDB';

const pool = new pg.Pool(configDB);
pool.connect();
module.exports = () => pool;
