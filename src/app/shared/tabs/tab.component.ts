import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
} from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-tab',
  template: `
    @if (active()) {
    <ng-content></ng-content>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabComponent implements AfterViewInit {
  @Input() title = '';
  @Input() showOnInit = false;
  @Output() close = new EventEmitter();

  active = signal(false);

  ngAfterViewInit() {
    this.active.set(this.showOnInit);
  }
  showTab() {
    this.active.set(true);
  }

  closeTab() {
    this.active.set(false);
    this.close.emit();
  }
}
