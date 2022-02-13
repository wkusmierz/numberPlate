import { createClient } from "redis";

type Dependencies = {
  url: string;
};

export interface CacheClient {
  getData(key: string): Promise<any | undefined>;
  persistData(key: string, data: any, expirationTime: number): Promise<boolean>;
  build(deps: Dependencies): Promise<RedisRepository>;
}

export class RedisRepository implements CacheClient {
  protected cacheClient: any;

  constructor() {}

  public async build({ url }: Dependencies) {
    const redis = new RedisRepository();
    redis.cacheClient = createClient({ url });
    await redis.cacheClient.connect();

    return redis;
  }

  private getRawData(key: string): Promise<any | undefined> {
    return this.cacheClient.get(key);
  }

  async getData(key: string): Promise<any | undefined> {
    const res = await this.getRawData(key);

    return JSON.parse(res);
  }

  async persistData(key: string, data: any, expirationTime: number) {
    return this.cacheClient.set(key, JSON.stringify(data), expirationTime);
  }
}
