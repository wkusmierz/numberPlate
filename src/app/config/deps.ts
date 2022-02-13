import { CarServiceImplementation } from "../../app/services/car.service";
import { FakeServiceImplementation } from "../../app/services/fake.service";
import { EventEmitter } from "events";
import { RedisRepository } from "../../app/services/cache.service";
import envs from "../../app/config/env";

export const initDependencies = async () => {
  const eventEmitter = new EventEmitter();
  const cacheClient = await new RedisRepository().build({ url: envs.redisUrl });
  const fakeService = new FakeServiceImplementation({ eventEmitter, cacheClient });
  const carService = new CarServiceImplementation({ fakeService });

  return {
    eventEmitter,
    cacheClient,
    fakeService,
    carService,
  };
};
