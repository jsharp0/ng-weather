import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  inject,
  Output,
  QueryList,
  signal,
  ViewChildren,
} from '@angular/core';
import { TabComponent } from './tab.component';
import { By } from '@angular/platform-browser';

@Component({
  standalone: true,
  selector: 'app-tab-group',
  imports: [],
  template: `
    <div class="tab">
      @for (title of tabTitles(); track $index) {
      <button class="tablinks" [class.active]="$index === activeTabIndex">
        <span (click)="showNewTab($index)">{{ title }}</span>
        <span aria-label="Close" (click)="closeTab($index)">&#10006;</span>
      </button>
      }
    </div>

    <!-- Tab content -->
    <ng-content></ng-content>
  `,
  styles: `
  
  .tab {
    overflow: hidden;
    border: 1px solid #ccc;
    background-color: #f1f1f1;

    span {
      margin-left: 1rem;
    }
    }

    /* Style the buttons that are used to open the tab content */
    .tab button:not(.close) {
        background-color: inherit;
        float: left;
        border: none;
        outline: none;
        cursor: pointer;
        padding: 14px 16px;
        transition: 0.3s;
        display: flex;
        align-items: center;
    }

    .tab button:hover {
      background-color: #ddd;
    }
    .tab button.active {
    background-color: #ccc;
    }


    `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabGroupComponent {
  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;
  tabTitles = signal<string[]>([]);
  activeTabIndex: number | undefined;
  ngAfterViewInit() {
    this.tabTitles.set(this.tabs?.map((x) => x.title) ?? []);

    this.tabs.changes.subscribe(() => {
      this.tabTitles.set(this.tabs.map((x) => x.title));
    });
  }

  showNewTab(tabIndex: number) {
    const activeTab = this.tabs.find((x) => x.active());
    this.activeTabIndex = tabIndex;
    if (activeTab) {
      activeTab.active.set(false);
    }
    this.tabs.get(tabIndex).showTab();
  }

  closeTab(index: number) {
    this.tabs.get(index).closeTab();
  }
}
