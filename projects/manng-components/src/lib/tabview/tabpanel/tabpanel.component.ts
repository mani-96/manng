import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { TabviewComponent } from '../tabview.component';

@Component({
  selector: 'man-tabpanel',
  templateUrl: './tabpanel.component.html',
  styleUrls: ['./tabpanel.component.scss']
})
export class TabpanelComponent implements OnInit {
  
  _selected;
  _disable = true;
    
  @Input() 
  get selected(): boolean {
    return this._selected;
  }
  set selected(val: boolean) {
      this._selected = val;
  }

  @Input()
  header;

  @Input()
  headerTemplate;

  @Input()
  confirmBeforeTabChange = false;

  @Input()
  index
  
  @Input()
  confirmationMessage = 'Are you sure you want to move away from this tab';

  @Input()
  disable = false

  @Input()
  componentInstance

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.disable && this.componentInstance && changes.disable.currentValue != changes.disable.previousValue) {
      TabviewComponent.disableTab(changes.disable.currentValue, this.componentInstance, this.index)
    }
    // Adding for initial loading. Component instance is not available at the very beggining
    if (!this.componentInstance && changes.disable && changes.disable.currentValue != changes.disable.previousValue) {
      setTimeout( () => {
        TabviewComponent.disableTab(changes.disable.currentValue, this.componentInstance, this.index)
      })
    }
  }

}
