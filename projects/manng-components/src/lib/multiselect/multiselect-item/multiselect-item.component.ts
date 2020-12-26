import { Component, OnInit, Input, ChangeDetectionStrategy, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { ObjectHelper } from '../../ObjectHelper';

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

  @Input('isLast')
  isLast;

  @Input('isFirst')
  isFirst;

  @Output('onOptionClick')
  onOptionClick =  new EventEmitter<any>();

  @Output('onOptionKeydown')
  onOptionKeydown =  new EventEmitter<any>()

  @Output('gotoPreviousElement')
  gotoPreviousElement = new EventEmitter<any>();

  ngOnInit() {
  }
  
  getOptionValue() {
    if (!this.field) {
      return this.option
    } else {
      let path = this.field.split('.');
      return ObjectHelper.deepValueFetch(path, this.option);
    }
  }

  optionKeydown(event){
    if (this.isLast) {
      if ( (event.which == 9 && !event.shiftKey) || event.which == 40) {
        event.preventDefault();
        return
      }
    } else if (this.isFirst) {
      if ((event.which == 9 && event.shiftKey) || event.which == 38) {
        event.preventDefault();
        this.gotoPreviousElement.emit();
        return
      }
    }
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
