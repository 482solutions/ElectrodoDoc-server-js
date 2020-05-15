const redis = require('redis');
const redisConfig = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
};
module.exports.redis = redis.createClient(redisConfig.port, redisConfig.host);