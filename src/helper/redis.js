const { redisClient: redis } = require("../configs/redis");

const saveData = async (key, value, ttl) => {
  try {
    return await redis.set(key, value, "EX", ttl);
  } catch (error) {
    throw new error();
  }
};

const getData = async (key) => {
  try {
    const data = await redis.get(key);

    if (!data) {
      return {
        remainingTime: 0,
        expired: true,
      };
    }
    return data;
  } catch (error) {
    throw error;
  }
};

const removeData = async (key) => {
  try {
    return await redis.del(key);
  } catch (error) {
    throw error;
  }
};

const saveDataAsHash = async (key, valueObj, expireInSeconds) => {
  try {
    await redis.multi().hset(key, valueObj).expire(key, expireInSeconds).exec();
  } catch (error) {
    throw error;
  }
};

const getDataAsHash = async (key) => {
  try {
    return await redis.hgetall(key);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  saveData,
  getData,
  removeData,
  saveDataAsHash,
  getDataAsHash,
};
