import { Component, OnInit, ContentChildren, QueryList, Input, EventEmitter, Output, ViewChild, HostListener, ChangeDetectorRef } from '@angular/core';
import { TabpanelComponent } from './tabpanel/tabpanel.component';
import { Subject } from 'rxjs';

@Component({
  selector: 'man-tabview',
  templateUrl: './tabview.component.html',
  styleUrls: ['./tabview.component.scss']
})
export class TabviewComponent implements OnInit {
  @ViewChild('scroll', {static : false})
  set scroll(val) {
    this.scrollPanel = val.nativeElement;
  }

  _openTabIndex = 0;

  _maxHeight;

  nav;
  
  panelMaxHeight;
  
  confirmationMessage = '';
  
  overlayVisible = false;
  
  confirmSwitchObservable = new Subject();
  
  confirmSwitchObservableSubscription;
  
  stopTabChangePropogation = false;
  
  hasNavigation = false;
  
  currentTranslate = 0;
  
  scrollPanel;

  resizeTimeout;

  tabs:any = [];

  currentWindowWidth = window.innerWidth;

  @Input() get openTabIndex(): number {
      return this._openTabIndex;
  }
  
  @Input('navWidth')
  navWidth = "100%";

  @Input('scrollJump')
  scrollJump = 100;

  set openTabIndex(val:number) {
    if (this.stopTabChangePropogation) {
      this.stopTabChangePropogation = false;
      return;
    }
    let currentTab =  this.findSelectedTab();
    if ( currentTab && currentTab.confirmBeforeTabChange ) {
      this.overlayVisible = true;
      this.confirmationMessage = this.tabs[this.openTabIndex].confirmationMessage;
      this.confirmSwitchObservableSubscription = this.confirmSwitchObservable.subscribe(data => {
        this.overlayVisible = false;
        if (data) {
          this.switchTab(val);
        } else {
          this.stopTabChangePropogation = true;
          this.openTabIndexChange.emit(this.openTabIndex);
        }
        if (this.confirmSwitchObservableSubscription) {
          this.confirmSwitchObservableSubscription.unsubscribe()
        }
      })
    } else {
      this.switchTab(val);
    }
  }

  switchTab(val: number) {
    if (this.tabs && this.tabs.length && this.tabs[val].disable) {
      this.stopTabChangePropogation = true;
      this.openTabIndexChange.emit(this.openTabIndex);
      return;
    }
    this._openTabIndex = val;
    if(this.tabs && this.tabs.length && this._openTabIndex != null && this.tabs.length > this._openTabIndex) {
        this.findSelectedTab().selected = false;
        this.tabs[this._openTabIndex].selected = true;
          setTimeout( () => {
            this.setTranslateOnTabSelection();
            this.cd.detectChanges();
          })
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

  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit() {
  }

  ngAfterContentInit() {
      this.initTabs();
      
      this.tabPanels.changes.subscribe( _ => {
          this.initTabs();
      });
  }

  
  initTabs(): void {
      this.tabs = this.tabPanels.toArray();
      // This check might not be needed
      if (this.tabs) {
        for (let i=0; i<this.tabs.length; i++) {
          this.tabs[i].componentInstance = this;
          this.tabs[i].index = i;
        }
      }
      let selectedTab: TabpanelComponent = this.findSelectedTab();
      if(!selectedTab && this.tabs.length) {
        if(this.openTabIndex != null && this.tabs.length > this.openTabIndex && !this.tabs[this.openTabIndex].disable)
            this.tabs[this.openTabIndex].selected = true;
        else
            this.tabs[0].selected = true;
      }
  }

  ngAfterViewInit() {
    this.setPanelMaxHeight();
    this.setHasNavigation();
    this.setTranslateOnTabSelection();
    this.cd.detectChanges();
  }

  setPanelMaxHeight() {
    this.panelMaxHeight = this._maxHeight - this.nav.getBoundingClientRect().height;
  }

  setHasNavigation() {
    this.hasNavigation = ( this.nav.getBoundingClientRect().width - this.scrollPanel.getBoundingClientRect().width ) > 1 ? true : false;
    if (this.hasNavigation) {
      this.currentTranslate = 35;
    } else {
      this.currentTranslate = 0;
    }
  }

  setTranslateOnTabSelection() {
    if (!this.scrollPanel)
      return;
    if (this.hasNavigation) {
      let selectedEl = this.scrollPanel.querySelector('.man-tab-selected');
      let scrollPanelWidth = this.scrollPanel.getBoundingClientRect().width
      let pos = (selectedEl.offsetLeft + selectedEl.offsetWidth) + this.currentTranslate;
      if (Math.floor(pos) >= (scrollPanelWidth - 39)) {
        this.currentTranslate = scrollPanelWidth - (selectedEl.offsetLeft + selectedEl.offsetWidth + 40)//-( pos - scrollPanelWidth)
      } else if (this.currentTranslate + selectedEl.offsetLeft < 40) {
        this.currentTranslate = 40 - selectedEl.offsetLeft;
      }
    }
  }

  showRight(event) {
    if (event.which != 1) return;
    let widthDiff = this.scrollPanel.getBoundingClientRect().width - this.nav.getBoundingClientRect().width - 40;
    this.currentTranslate =  (this.currentTranslate - this.scrollJump) > widthDiff  ? (this.currentTranslate - this.scrollJump) : widthDiff;
  }

  showLeft(event) {
    if (event.which != 1) return;
    this.currentTranslate =  (this.currentTranslate + this.scrollJump) < 40  ? (this.currentTranslate + this.scrollJump) : 40;
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
    if ( this.tabs[idx].disable) {
      return;
    }
    this.openTabIndexChange.emit(idx);
  }

  confirmSwitch(val: boolean) {
    this.confirmSwitchObservable.next(val);
  }

  static disableTab(event, instance: TabviewComponent, index) {
    if (instance && instance.tabs[index]) {
      instance.tabs[index].disable = event;
      instance.cd.detectChanges()
    }    
  }

  static updateShowConfirmation(event, instance: TabviewComponent, index) {
    if (instance && instance.tabs[index]) {
      instance.tabs[index].confirmBeforeTabChange = event;
      instance.cd.detectChanges()
    }   

  }

  ngOnDestroy(){
    if (this.confirmSwitchObservableSubscription)
      this.confirmSwitchObservable.unsubscribe();
  }

  @HostListener('window: resize')
  resize() {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout)
    }
    this.resizeTimeout = setTimeout( () => {
      // Chrome height changes on scroll, dont need to set properties when only heigh change
      if (window.innerWidth != this.currentWindowWidth) {
        this.currentWindowWidth = window.innerWidth;
        this.setPanelMaxHeight();
        this.setHasNavigation();
        this.setTranslateOnTabSelection();
      }
    }, 100)
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
