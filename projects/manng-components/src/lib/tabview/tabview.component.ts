import { Component, OnInit, ContentChildren, QueryList, Input, EventEmitter, Output, ViewChild, HostListener, ChangeDetectorRef } from '@angular/core';
import { TabpanelComponent } from './tabpanel/tabpanel.component';

@Component({
  selector: 'man-tabview',
  templateUrl: './tabview.component.html',
  styleUrls: ['./tabview.component.scss']
})
export class TabviewComponent implements OnInit {
  _openTabIndex = 0;
  _maxHeight;
  nav;
  panelMaxHeight

  @Input() get openTabIndex(): number {
      return this._openTabIndex;
  }
  set openTabIndex(val:number) {
      this._openTabIndex = val;
      if(this.tabs && this.tabs.length && this._openTabIndex != null && this.tabs.length > this._openTabIndex) {
          this.findSelectedTab().selected = false;
          this.tabs[this._openTabIndex].selected = true;
      }
  }

  @Input()
  set maxHeight(value) {
    this._maxHeight = value;
    if (this.nav) {
      this.setPanelMaxHeight();
    }
  }

  @ViewChild('navigation', {static: false})
  set navigation(nav) {
    if (nav) {
      this.nav = nav.nativeElement;
    }
  }

  @Output()
  openTabIndexChange: EventEmitter<number> = new EventEmitter()

  @ContentChildren(TabpanelComponent) tabPanels : QueryList<TabpanelComponent>

  tabs

  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit() {
  }

  ngAfterContentInit() {
      this.initTabs();
      
      this.tabPanels.changes.subscribe(_ => {
          this.initTabs();
      });
  }
  ngAfterViewInit() {
    this.setPanelMaxHeight();
  }

  setPanelMaxHeight() {
    this.panelMaxHeight = this._maxHeight - this.nav.getBoundingClientRect().height;
    this.cd.detectChanges();
  }
  
  initTabs(): void {
      this.tabs = this.tabPanels.toArray();
      let selectedTab: TabpanelComponent = this.findSelectedTab();
      if(!selectedTab && this.tabs.length) {
          if(this.openTabIndex != null && this.tabs.length > this.openTabIndex)
              this.tabs[this.openTabIndex].selected = true;
          else
              this.tabs[0].selected = true;
      }
  }
  
  findSelectedTab() {
    for(let i = 0; i < this.tabs.length; i++) {
        if(this.tabs[i].selected) {
            return this.tabs[i];
        }
    }
    return null;
  }

  tabSelected(idx) {
    this.openTabIndexChange.emit(idx);
  }

  @HostListener('window: resize')
  resize() {
    console.log('resize')
    this.setPanelMaxHeight();
  }

}
