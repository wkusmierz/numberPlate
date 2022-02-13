import { FakeService } from "./fake.service";

interface CarService {
  getPrice(numberPlate: string, skipCacheForRead: boolean): Promise<number>;
}

type Dependencies = {
  fakeService: FakeService;
};

export class CarServiceImplementation implements CarService {
  private fakeService: FakeService;

  constructor(deps: Dependencies) {
    this.fakeService = deps.fakeService;
  }

  async getPrice(numberPlate: string, skipCacheForRead = true) {
    return this.fakeService.getExternalPrice(numberPlate, skipCacheForRead);
  }
}
