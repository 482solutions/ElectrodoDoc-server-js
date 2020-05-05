const redis = require('redis');
const redisConfig = {
    host: '127.0.0.1',
    port: 6379
};
module.exports.redis = redis.createClient(redisConfig.port, redisConfig.host);