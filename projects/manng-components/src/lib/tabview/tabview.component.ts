import { Component, OnInit, ContentChildren, QueryList, Input, EventEmitter, Output, ViewChild, HostListener, ChangeDetectorRef } from '@angular/core';
import { TabpanelComponent } from './tabpanel/tabpanel.component';
import { Subject } from 'rxjs';

@Component({
  selector: 'man-tabview',
  templateUrl: './tabview.component.html',
  styleUrls: ['./tabview.component.scss']
})
export class TabviewComponent implements OnInit {
  _openTabIndex = 0;
  _maxHeight;
  nav;
  panelMaxHeight;
  confirmationMessage = '';
  overlayVisible = false;
  confirmSwitchObservable = new Subject();
  stopTabChangePropogation = false;

  @Input() get openTabIndex(): number {
      return this._openTabIndex;
  }
  set openTabIndex(val:number) {
    if (this.stopTabChangePropogation) {
      this.stopTabChangePropogation = false;
      return;
    }
    let currentTab =  this.findSelectedTab();
    if ( currentTab && currentTab.confirmBeforeTabChange ) {
      this.overlayVisible = true;
      this.confirmationMessage = this.tabs[this.openTabIndex].confirmationMessage;
      this.confirmSwitchObservable.subscribe(data => {
        this.overlayVisible = false;
        if (data) {
          this.switchTab(val);
        } else {
          this.stopTabChangePropogation = true;
          this.openTabIndexChange.emit(this.openTabIndex);
        }
      })
    } else {
      this.switchTab(val);
    }
  }

  switchTab(val: number) {
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
  openTabIndexChange: EventEmitter<number> = new EventEmitter();

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
    if (!this.tabs) 
      return null;
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

  confirmSwitch(val: boolean) {
    this.confirmSwitchObservable.next(val);
  }

  @HostListener('window: resize')
  resize() {
    this.setPanelMaxHeight();
  }
  
  @HostListener('document: keydown', ['$event'])
  handleKeydown(event) {
    if (this.overlayVisible && event.which == 27) {
      this.overlayVisible = false;
      this.confirmSwitchObservable.next(false)
      event.preventDefault();
    }
  }

}
