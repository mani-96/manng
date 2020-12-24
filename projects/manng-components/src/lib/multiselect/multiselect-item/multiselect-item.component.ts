import { Component, OnInit, Input, ChangeDetectionStrategy, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'man-multiselect-item',
  templateUrl: './multiselect-item.component.html',
  styleUrls: ['./multiselect-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MultiselectItemComponent implements OnInit {

  constructor(private cd: ChangeDetectorRef) { }

  @Input('selected')
  selected;

  @Input('field')
  field;

  @Input('option')
  option;

  @Output('onOptionClick')
  onOptionClick =  new EventEmitter<any>();

  @Output('onOptionKeydown')
  onOptionKeydown =  new EventEmitter<any>()

  ngOnInit() {
  }
  
  getOptionValue() {
    if (!this.field) {
      return this.option
    } else {
      this.option[this.field]
    }
  }

  optionKeydown(event){
    this.onOptionKeydown.emit({
      originalEvent: event,
      option: this.option
    })

  }

  optionClicked(event) {
    event.target.parentElement.focus();
    this.onOptionClick.emit(this.option);
  }

}
