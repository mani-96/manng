import { Component, OnInit, ChangeDetectionStrategy, Input, Output, ViewChild, ElementRef, HostListener, ChangeDetectorRef, Renderer2, EventEmitter } from '@angular/core';
import { DOMHandler } from '../DOMHandler';
import { ObjectHelper } from '../ObjectHelper';

@Component({
  selector: 'man-typeahead',
  templateUrl: './typeahead.component.html',
  styleUrls: ['./typeahead.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TypeaheadComponent implements OnInit {

  @ViewChild('overlayPanel', {static: false})
  set overlayPanel(value) {
    if (value) {
      this.panel = value.nativeElement;
      this.show()
    }
  }

  @ViewChild('typeaheadInput', {static: false})
  typeaheadInput;
  

  /*Value to resolve and show in input box */
  @Input('field')
  field;

  @Input('searchExternal')
  searchExternal = false;

  @Input('panelHeight')
  panelHeight = 200;

  @Input('options')
  set dataList(value: Array<any>) {
    this.highlightedOptionIndex = null;
    if (value && value.length) {
      this._dataList = value.slice(0);
    } else {
      this._dataList = [];
    }
    if (this.searchExternal) {
      this.result = value;
    }
  }

  @Input('showDropdownIcon')
  showDropdownIcon = false;

  /** Show complete or filtered list on focus
    default filtered
    options - filtered | complete */
  @Input('listBehaviorOnFocus')
  onFocusListValues = 'filtered';

  @Input('disable')
  set disable(value) {
    this.isDisabled = value;
  }

  @Input('mandatorySelection')
  mandatorySelection = false;

  @Input('inputId')
  id = '';

  @Input('debounceTime')
  debounceTime = 50;

  @Input('inputStyleClass')
  inputStyleClass = ''

  @Input('overlayStyleClass')
  overlayStyleClass = ''

  @Input('optionTemplate')
  optionTemplate

  @Output()
  onKeydown = new EventEmitter<any>();

  result = [];
  selectedValue: any = '';
  _dataList = [];

  isDisabled = false;
  panel;
  overlayVisible = false;
  calculatedMaxHeight = 200;
  top = 0;
  width = 0;
  left = 0;
  documentClickListener;
  inputValue = '';
  highlightedOptionIndex = null;
  inputTimeout;
  

  modelChange: Function = () => {};
  modelTouched: Function = () => {};

  constructor(private el: ElementRef, private cd: ChangeDetectorRef, private renderer: Renderer2) { }

  ngOnInit() {
  }

  /*model -> view*/
  writeValue(value) {
    if (value) {
      this.selectedValue = value;
      this.inputValue = ObjectHelper.resolveFieldData(value, this.field);
    } else {
      this.selectedValue = '';
      this.inputValue = ''
    }
  }

  /*view -> model*/
  registerOnChange(func) {
    this.modelChange = func;
  }

  registerOnTouched(func) {
    this.modelTouched = func;

  }

  setDisabledState(disabled) {
    if (disabled) {
      this.isDisabled = true;
    } else {
      this.isDisabled = false;
    }
  }

  onInputFocus() {
    this.modelTouched(true);
    if (!this.searchExternal) {
      if (!this.overlayVisible) {
        this.overlayVisible = true;
      }
      if(this.onFocusListValues == 'filtered') {
        this.updateDropDownValue(this.inputValue);
      } else {
        this.updateDropDownValue('');
      }
    }
  }

  valueEntered(event) {
    if (this.inputTimeout) {
      clearTimeout(this.inputTimeout)
    }
    this.highlightedOptionIndex = null;
    let searchValue = event.target.value;
    this.inputValue = searchValue;
    this.inputTimeout = setTimeout( () => {
      this.onKeydown.emit(searchValue);
    }, this.debounceTime)
    if (!this.mandatorySelection) {
      this.modelChange(this.inputValue);
    } else {
      this.selectedValue = '';
      this.modelChange('');
    }
    if (!this.searchExternal) {
      this.updateDropDownValue(searchValue);
    }
    if (!this.overlayVisible) {
      this.overlayVisible = true;
    }
  }

  show() {
    this.calculatedMaxHeight = this.panelHeight;
    document.body.appendChild(this.panel);
    let panelProp = DOMHandler.getPanelProperties(this.el.nativeElement.children[0], this.panel);
    this.top = panelProp.top;
    this.width = panelProp.width;
    this.left = panelProp.left;
    if (panelProp.height) {
      this.calculatedMaxHeight = panelProp.height
    }
    this.bindClickEventListener()
    this.cd.detectChanges();
  }

  hide() {
    if (this.mandatorySelection && !this.selectedValue) {
      this.modelChange('');
      this.inputValue = ''
    }
    this.overlayVisible = false;
    this.unbindClickEventListener();
    this.highlightedOptionIndex = null;
  }

  getOptionValue(option) {
    if (!this.field) {
      return option;
    } else {
      return ObjectHelper.resolveFieldData(option, this.field)
    }
  }

  optionSelected(option) {
    this.selectedValue = option;
    this.inputValue = this.field ? ObjectHelper.resolveFieldData(option, this.field) : option;
    this.typeaheadInput.nativeElement.focus();
    this.overlayVisible = false;
    this.modelChange(option)
  }

  updateDropDownValue(filterValue) {
    if (!this._dataList) {
      console.error('Typeahead -> _dataList should be an array');
      return;
    } 
    this.result = this._dataList.filter(key => {
      let value = ObjectHelper.resolveFieldData(key, this.field);
      if (value != null && value != undefined) {
        filterValue = (filterValue != null && filterValue != undefined) ? filterValue.toString() : '';
        return value.toString().toLowerCase().indexOf(filterValue.toLowerCase()) != -1
      }
      return false
    });
  }
  onKeyDown(event) {
    switch(event.which) {
      //down
      case 40:
        if (this.overlayVisible) {
          if (this.highlightedOptionIndex != null) {
            this.highlightedOptionIndex = this.highlightedOptionIndex < (this.result.length - 1) ? (this.highlightedOptionIndex + 1) : this.highlightedOptionIndex;
          } else {
            this.highlightedOptionIndex = 0;
          }
          this.scrollItemInView();
          event.preventDefault();
        }
      break;

      //up
      case 38:
        if (this.overlayVisible) {
          if (this.highlightedOptionIndex - 1 >= 0) {
            this.highlightedOptionIndex = this.highlightedOptionIndex - 1;
            this.scrollItemInView();
          }
          event.preventDefault();
        }
      break;

      //enter
      case 13:
      if (this.highlightedOptionIndex != null) {
        this.optionSelected(this.result[this.highlightedOptionIndex])
      }     
      break;

      //tab
      case 9:
      this.hide();
      break;

      //esc
      case 27:
      this.hide();
      break;
    }
  }

  scrollItemInView() {
      this.cd.detectChanges();
      let el = document.querySelector('li.man-option-highlighted');
      DOMHandler.scrollInView(this.panel, el);
  }

  bindClickEventListener() {
    if (!this.documentClickListener) {
        const documentTarget: any = this.el ? this.el.nativeElement.ownerDocument : 'document';
        this.documentClickListener = this.renderer.listen(documentTarget, 'click', (event) => {
            if (event.which === 3) {
                return;
            }
            if ((this.panel && !this.panel.contains(event.target)) && !this.el.nativeElement.contains(event.target)) {
              this.hide();
            }
            this.cd.detectChanges();
        });
    }
  }

  unbindClickEventListener() {
    if (this.documentClickListener) {
      this.documentClickListener();
      this.documentClickListener = null;
    }
  }

  @HostListener('window: resize') 
  handleResize() {
    this.calculatedMaxHeight = this.panelHeight;
    if (this.overlayVisible) {
      let panelProp = DOMHandler.getPanelProperties(this.el.nativeElement.children[0], this.panel);
      this.top = panelProp.top;
      this.width = panelProp.width;
      this.left = panelProp.left;
      if (panelProp.height) {
        this.calculatedMaxHeight = panelProp.height
      }
      this.cd.detectChanges();
    }
  }

}
