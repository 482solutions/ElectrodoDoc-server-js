import redis from 'redis';

const redisConfig = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
};

const redisClient = redis.createClient(redisConfig.port, redisConfig.host);
export { redisClient };
