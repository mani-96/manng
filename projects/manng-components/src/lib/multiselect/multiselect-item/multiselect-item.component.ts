import { Component, OnInit, Input, ChangeDetectionStrategy, Output, EventEmitter, ChangeDetectorRef, TemplateRef } from '@angular/core';
import { ObjectHelper } from '../../ObjectHelper';

@Component({
  selector: 'man-multiselect-item',
  templateUrl: './multiselect-item.component.html',
  styleUrls: ['./multiselect-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MultiselectItemComponent implements OnInit {

  constructor(private cd: ChangeDetectorRef) { }

  @Input('optionTemplate')
  optionTemplate

  @Input('selectionLimit')
  selectionLimit

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

  @Input('limitReached')
  limitReached = true;

  @Output('onOptionClick')
  onOptionClick =  new EventEmitter<any>();

  @Output('onOptionKeydown')
  onOptionKeydown =  new EventEmitter<any>()

  @Output('gotoPreviousElement')
  gotoPreviousElement = new EventEmitter<any>();

  isDisabled = false;

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.limitReached && !this.selected) {
      this.isDisabled = true;
    } else {
      this.isDisabled = false;
    }
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
    if (this.isDisabled && event.which == 13) {
      event.preventDefault();
      return;
    }
    this.onOptionKeydown.emit({
      originalEvent: event,
      option: this.option
    })

  }

  optionClicked(event) {
    event.target.parentElement.focus();
    if (this.isDisabled) {
      return;
    }
    this.onOptionClick.emit(this.option);
  }

}
