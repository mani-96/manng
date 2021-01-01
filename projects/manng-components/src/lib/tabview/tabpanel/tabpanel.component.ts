import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'man-tabpanel',
  templateUrl: './tabpanel.component.html',
  styleUrls: ['./tabpanel.component.scss']
})
export class TabpanelComponent implements OnInit {
  
  _selected
    
  @Input() get selected(): boolean {
    return this._selected;
  }

  @Input()
  header;

  @Input()
  headerTemplate;

  @Input()
  confirmBeforeTabChange = false;
  
  @Input()
  confirmationMessage = 'Are you sure you want to move away from this tab';

  set selected(val: boolean) {
      this._selected = val;
  }

  constructor() { }

  ngOnInit() {
  }

}
