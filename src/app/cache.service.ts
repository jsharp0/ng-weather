import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  cachingDurationInMs = 2 * 60 * 60 * 1000;

  writeToLocalStorage(key: string, value: unknown) {
    const jsonToSave = JSON.stringify({
      cachedDate: new Date(),
      data: value,
    });
    localStorage.setItem(key, jsonToSave);
  }

  readFromLocalStorage<T>(key: string): T {
    const retrievedData = localStorage.getItem(key);
    let parsedData: { cachedDate: Date; data: T } = {
      cachedDate: new Date(),
      data: null,
    };
    if (retrievedData) {
      parsedData = JSON.parse(retrievedData);

      if (!this.isCacheExpired(new Date(parsedData.cachedDate))) {
        return parsedData.data;
      } else {
        parsedData.data = null;
        localStorage.removeItem(key);
      }
    }
    return parsedData.data;
  }

  removeFromLocalStorage(key: string) {
    localStorage.removeItem(key);
  }

  private isCacheExpired(cachedDate: Date) {
    const cachedDateMs = cachedDate.getTime();
    const today = new Date().getTime();
    const differenceMs = Math.abs(cachedDateMs - today);
    return differenceMs >= this.cachingDurationInMs;
  }
}
