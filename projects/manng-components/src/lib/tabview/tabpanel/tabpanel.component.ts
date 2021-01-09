import { Component, OnInit, Input, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { TabviewComponent } from '../tabview.component';

@Component({
  selector: 'man-tabpanel',
  templateUrl: './tabpanel.component.html',
  styleUrls: ['./tabpanel.component.scss']
})
export class TabpanelComponent implements OnInit {
  
  _selected = false;
  _disable = true;
    
  @Input() 
  get selected(): boolean {
    return this._selected;
  }
  set selected(val: boolean) {
      this._selected = val;
      this.cd.detectChanges();
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

  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.disable && this.componentInstance && changes.disable.currentValue != changes.disable.previousValue) {
      TabviewComponent.disableTab(changes.disable.currentValue, this.componentInstance, this.index)
    }
    if (this.componentInstance && changes.confirmBeforeTabChange && changes.confirmBeforeTabChange.currentValue != changes.confirmBeforeTabChange.previousValue) 
     TabviewComponent.updateShowConfirmation(changes.confirmBeforeTabChange.currentValue, this.componentInstance, this.index)
    // Adding for initial loading. Component instance is not available at the very beggining
    if (!this.componentInstance) {
      setTimeout( () => {
        if (!this.componentInstance) return;
        if (changes.disable && changes.disable.currentValue != changes.disable.previousValue)
          TabviewComponent.disableTab(changes.disable.currentValue, this.componentInstance, this.index);
         if (changes.confirmBeforeTabChange && changes.confirmBeforeTabChange.currentValue != changes.confirmBeforeTabChange.previousValue) 
          TabviewComponent.updateShowConfirmation(changes.confirmBeforeTabChange.currentValue, this.componentInstance, this.index)
      })
    }
  }

}
