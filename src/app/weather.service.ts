import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { CurrentConditions } from './current-conditions/current-conditions.type';
import { ConditionsAndZip } from './conditions-and-zip.type';
import { Forecast } from './forecasts-list/forecast.type';
import { map, tap } from 'rxjs/operators';
import { CacheService } from './cache.service';

@Injectable()
export class WeatherService {
  static URL = 'https://api.openweathermap.org/data/2.5';
  static APPID = '5a4b2d457ecbef9eb2a71e480b947604';
  static ICON_URL =
    'https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/';

  constructor(private http: HttpClient, private cacheService: CacheService) {}

  getCurrentConditionsAPI(zipcode: string): Observable<ConditionsAndZip> {
    const currentConditions =
      this.cacheService.readFromLocalStorage<ConditionsAndZip>(zipcode);
    if (currentConditions) {
      return of(currentConditions);
    }
    return this.http
      .get<CurrentConditions>(
        `${WeatherService.URL}/weather?zip=${zipcode},us&units=imperial&APPID=${WeatherService.APPID}`
      )
      .pipe(
        map((data) => ({ zip: zipcode, data })),
        tap((conditionsAndZip) => {
          this.cacheService.writeToLocalStorage(zipcode, conditionsAndZip);
        })
      );
  }

  getForecast(zipcode: string): Observable<Forecast> {
    const cachedForecast = this.cacheService.readFromLocalStorage<Forecast>(
      `five-day-${zipcode}`
    );

    if (cachedForecast) {
      return of(cachedForecast);
    }
    // Here we make a request to get the forecast data from the API. Note the use of backticks and an expression to insert the zipcode
    return this.http
      .get<Forecast>(
        `${WeatherService.URL}/forecast/daily?zip=${zipcode},us&units=imperial&cnt=5&APPID=${WeatherService.APPID}`
      )
      .pipe(
        tap((data) => {
          this.cacheService.writeToLocalStorage(`five-day-${zipcode}`, data);
        })
      );
  }

  getWeatherIcon(id): string {
    if (id >= 200 && id <= 232)
      return WeatherService.ICON_URL + 'art_storm.png';
    else if (id >= 501 && id <= 511)
      return WeatherService.ICON_URL + 'art_rain.png';
    else if (id === 500 || (id >= 520 && id <= 531))
      return WeatherService.ICON_URL + 'art_light_rain.png';
    else if (id >= 600 && id <= 622)
      return WeatherService.ICON_URL + 'art_snow.png';
    else if (id >= 801 && id <= 804)
      return WeatherService.ICON_URL + 'art_clouds.png';
    else if (id === 741 || id === 761)
      return WeatherService.ICON_URL + 'art_fog.png';
    else return WeatherService.ICON_URL + 'art_clear.png';
  }
}
