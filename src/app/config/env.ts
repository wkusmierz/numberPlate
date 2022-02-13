import "dotenv/config";

type EnvVariables = {
  redisUrl: string;
};

const loadEnvs = () =>
  ({
    redisUrl: process.env.REDIS_URL,
  } as EnvVariables);

export default loadEnvs();
