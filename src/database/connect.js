const pg = require('pg');
const configDB = require('./configDB');


const pool = new pg.Pool(configDB);
pool.connect();
module.exports = (params) => {
    return pool;
};

