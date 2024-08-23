import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CacheService } from '../cache.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
})
export class MainPageComponent {
  cacheDuration = new FormControl();

  constructor(private cacheService: CacheService) {}

  updateCacheDuration() {
    this.cacheService.cachingDurationInMs = this.cacheDuration.value;
    this.cacheDuration.reset();
  }
}
