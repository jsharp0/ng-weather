import { Component, inject } from '@angular/core';
import { WeatherService } from '../weather.service';
import { LocationService } from '../location.service';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-current-conditions',
  templateUrl: './current-conditions.component.html',
  styleUrls: ['./current-conditions.component.css'],
})
export class CurrentConditionsComponent {
  private weatherService = inject(WeatherService);
  private router = inject(Router);
  protected locationService = inject(LocationService);
  conditions$ = this.locationService.locationsSubject.pipe(
    switchMap((zipCodes) =>
      zipCodes.length
        ? forkJoin(
            zipCodes.map((code) =>
              this.weatherService.getCurrentConditionsAPI(code)
            )
          )
        : of([])
    )
  );

  showForecast(zipcode: string) {
    this.router.navigate(['/forecast', zipcode]);
  }
}
