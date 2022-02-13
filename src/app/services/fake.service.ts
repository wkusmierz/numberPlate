import { EventEmitter } from "stream";

const cars = {
  name: ["Cupra", "Seat", "Volkswagen", "Porshe", "Bentley", "Audi", "Ford"],
  colour: ["red", "green", "blue", "white", "black", "yellow"],
  type: ["SUV", "SEDAN", "COUPE", "HATCHBACK", "CONVERTIBLE"],
  price: [1000, 3000, 5000, 8000, 10000],
};
export interface FakeService {
  getExternalPrice(numberPlate: string, skipCache: boolean): Promise<any>;
}

type Dependencies = {
  eventEmitter: EventEmitter;
  cacheClient: any;
};

export class FakeServiceImplementation implements FakeService {
  private eventEmmiter: EventEmitter;

  private cacheClient: any;

  private fetchingPlatesSet: Set<String>;

  constructor(dependencies: Dependencies) {
    this.eventEmmiter = dependencies.eventEmitter;
    this.cacheClient = dependencies.cacheClient;
    this.fetchingPlatesSet = new Set();

    this.eventEmmiter.on("GET_PLATE", async (numberPlate: string) => {
      this.fetchingPlatesSet.add(numberPlate);
      const data = await this.fetch(numberPlate);

      this.eventEmmiter.emit(`FETCHED_PLATE_${numberPlate}`, data);
    });
  }

  private waitFor = async (time: number) => new Promise((resolve) => setTimeout(resolve, time));

  private getCachedValue(numberPlate: string) {
    return this.cacheClient.getData(numberPlate);
  }

  private setCacheValue(numberPlate: string, data: any, expirationTime = 36000) {
    return this.cacheClient.persistData(numberPlate, data, expirationTime);
  }

  private random(items: any[]) {
    return items[Math.floor(Math.random() * items.length)];
  }

  private getRandomData() {
    return {
      price: this.random(cars.price),
      name: this.random(cars.name),
      colour: this.random(cars.colour),
      type: this.random(cars.type),
    };
  }

  private async fetch(numberPlate: string) {
    const data = {
      numberPlate,
      details: this.getRandomData(),
    };

    await this.waitFor(10000);
    await this.setCacheValue(numberPlate, data);

    return { data };
  }

  async getExternalPrice(numberPlate: string, skipCache: boolean) {
    const cachedResult = await this.getCachedValue(numberPlate);

    if (cachedResult && !skipCache) return { data: cachedResult };

    if (!this.fetchingPlatesSet.has(numberPlate)) {
      this.eventEmmiter.emit("GET_PLATE", numberPlate);
    }

    return new Promise((resolve) =>
      this.eventEmmiter.on(`FETCHED_PLATE_${numberPlate}`, (value) => {
        this.fetchingPlatesSet.delete(numberPlate);
        resolve(value);
      })
    );
  }
}
