import { Component, OnInit, forwardRef, Input, ElementRef, ChangeDetectionStrategy, Renderer2, ViewEncapsulation, ChangeDetectorRef, HostListener, Output, EventEmitter, SimpleChanges, ViewChild, QueryList, ContentChildren } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { DOMHandler } from '../DOMHandler';
import { ObjectHelper } from '../ObjectHelper';

const formValueAccessor = {
  provide: NG_VALUE_ACCESSOR,
  multi: true,
  useExisting: forwardRef( () => MultiselectComponent)
  };

@Component({
  selector: 'man-multiselect',
  templateUrl: './multiselect.component.html',
  styleUrls: ['./multiselect.component.scss'],
  providers: [formValueAccessor],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class MultiselectComponent implements OnInit, ControlValueAccessor {

  @ViewChild('panel', {static: false})
  set contentPanel(panel) {
    if (panel) {
      this.panel = panel.nativeElement;
    }
  }

  @ViewChild('inputSearch', {static: false})
  inputSearch; 

  @ViewChild('selectAll', {static: false})
  selectAll
    
  @Input('options')
  options: Array<any>;
  
  @Input('field')
  field: string;

  @Input('scrollHeight')
  scrollHeight = 200;

  @Input('selectionLimit')
  selectionLimit = null;

  @Input('disable')
  disabled = false;

  @Input('showSearch')
  showSearch = true;

  @Input('optionTemplate')
  optionTemplate

  @Input('inputStyleClass')
  inputStyleClass = ''

  @Input('overlayStyleClass')
  overlayStyleClass = '';

  @Input('selectedLabelLength')
  selectedLabelLength = 2;

  @Output('onSelect')
  onSelect = new EventEmitter<any>();



  allChecked = false;

  width = 100;
  
  overlayVisible = false;
  
  documentClickListener;

  valuesSelected = [];
  
  top;
  
  left;
  
  calculatedMaxHeight;
  
  panel;

  renderedOptions = [];

  appendedToBody = false;

  searchInput = '';

  searchTimeout;

  toggleTimeout;

  constructor(private el: ElementRef, private cd: ChangeDetectorRef, private renderer: Renderer2) { }
    
  modelChanged: any = () => {}
  touched: any = () => {}
    
  inputValue = '';
    
  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.options.currentValue) {
      this.renderedOptions = changes.options.currentValue;
    }
  }
    
  writeValue(value) {
    if (!value) {
      return;
    }
    this.allChecked = false;
    this.valuesSelected = value;
    if (value.length == this.options.length) { 
      this.allChecked = true; 
    }
  } 

  registerOnChange(fn) { 
    this.modelChanged = fn; 
  } 

  registerOnTouched(fn) { 
    this.touched= fn; 
  }

  setDisabledState(val: boolean) {
    this.disabled = val;
  }

  toggleOpen() {
    if (this.toggleTimeout) {
      clearTimeout(this.toggleTimeout)
    }
    if (this.disabled) {
      return;
    }
    this.touched();
    this.toggleTimeout = setTimeout( () => {
      if (!this.overlayVisible) { 
        this.overlayVisible = true;
        this.cd.detectChanges();
        this.show();
      } else {
        this.hideList();
      } 
    })
  }

  show() {
    this.calculateLeftAndTopPosition();
    if (this.appendedToBody) {
      return;
    }
    document.body.appendChild(this.panel);
    this.appendedToBody = true;
    if (this.selectAll && !this.showSearch) {
      this.selectAll.nativeElement.focus();
    }
    this.bindClickEventListener();
  }

  calculateLeftAndTopPosition() {
    this.calculatedMaxHeight = this.scrollHeight;
    let panelProp = DOMHandler.getPanelProperties(this.el.nativeElement, this.panel);
    this.top = panelProp.top;
    this.width = panelProp.width;
    this.left = panelProp.left;
    if (panelProp.height) {
      this.calculatedMaxHeight = panelProp.height;
    }
    this.cd.detectChanges();
  }

  hideList() {
    if (!this.overlayVisible)
      return;
    document.body.removeChild(this.panel)
    this.overlayVisible = false;
    this.appendedToBody = false;
    this.unbindClickEventListener();
    this.cd.detectChanges();
  }

  allClicked(event?) {
    if (event && event.target.parentElement) {
      event.target.parentElement.focus();
    }
    if (this.selectionLimit) 
      return;
    if (!this.allChecked) { 
      this.checkAll(); 
    } else { 
      this.uncheckAll(); 
    } 
  } 

  checkAll() { 
    if (!this.showSearch) {
      this.valuesSelected = this.options.slice(0, this.options.length);
    } else {
      for (let i=0; i<this.renderedOptions.length; i++) {
        if (!this.isOptionSelected(this.renderedOptions[i])) {
          this.valuesSelected.push(this.renderedOptions[i])
        }
      }
    }
    this.allChecked = true;
    this.setInputValueOnCheck();
  } 

  uncheckAll() { 
    this.allChecked = false; 
    if (!this.showSearch) {
      this.valuesSelected = [];
      this.inputValue = '';
      this.cd.detectChanges();
    } else {
      let index;
      for (let i=0; i<this.renderedOptions.length; i++) {
        index = this.getSelectedOptionIndex(this.renderedOptions[i])
        if (index >= 0) {
          this.valuesSelected.splice(index, 1)
        }
      }
      this.setInputValueOnCheck();
    }
    this.onSelect.emit([]);
  } 

  optionClicked(value) {
    let selectedIndex = this.getSelectedOptionIndex(value)
    if (selectedIndex >= 0) {
      this.valuesSelected.splice(selectedIndex, 1)
    } else if ((this.selectionLimit != null && this.valuesSelected.length < this.selectionLimit) || this.selectionLimit == null){
      this.valuesSelected.push(value);
    }
    this.setInputValueOnCheck();
  }

  isOptionSelected(option) {
    return this.getSelectedOptionIndex(option) >= 0;
  }

  getSelectedOptionIndex(option) {
    let index = -1
    for (let i=0; i<this.valuesSelected.length; i++) {
      if (ObjectHelper.isObjectequal(this.valuesSelected[i], option, this.field)) {
        index = i;
        break;
      }
    }
    return index;
  }
  
  setInputValueOnCheck() { 
    let filtered: Array<any> = this.valuesSelected.slice();
    this.onSelect.emit(filtered);
    this.allChecked = false; 
    if (filtered.length > 0) {
      if (!this.field) {
        this.inputValue = filtered.length <= this.selectedLabelLength ? filtered.slice(0, this.selectedLabelLength).join(', ') : (filtered.length + ' items selected');
      } else {
        this.inputValue = filtered.length <= this.selectedLabelLength ? filtered.slice(0, this.selectedLabelLength).map(key => ObjectHelper.resolveFieldData(key, this.field)).join(', ') :(filtered.length + ' items selected');
      }
      this.modelChanged(filtered);
    } else {
      this.inputValue = '';
      this.modelChanged(null);
    }
    this.getIsAllChecked();
  }

  bindClickEventListener() {
    if (!this.documentClickListener) {
        const documentTarget: any = this.el ? this.el.nativeElement.ownerDocument : 'document';
        this.documentClickListener = this.renderer.listen(documentTarget, 'click', (event) => {
            if (event.which === 3) {
                return;
            }
            if ((this.panel && !this.panel.contains(event.target)) && !this.el.nativeElement.contains(event.target)) {
              this.hideList();
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

  onKeyDown(event, index, option) {
    switch(event.originalEvent.which) {
      //down
      case 40:
          let nextItem = this.findNextItem(event.originalEvent.target.parentElement);
          if (nextItem && nextItem.children[0]) {
              nextItem.children[0].focus();
          }
          event.originalEvent.preventDefault();
      break;

      //up
      case 38:
          let prevItem = this.findPrevItem(event.originalEvent.target.parentElement);
          if (prevItem && prevItem.children[0]) {
            prevItem.children[0].focus();
          }

          event.originalEvent.preventDefault();
      break;

      //enter
      case 13:
      if (index == 'all') {
        this.allChecked ? this.allClicked({target: {checked: false}}) : this.allClicked({target: {checked: true}})
      } else { 
        this.optionClicked(option)
      }           
      break;

      //esc
      case 27:
      this.escapeKeydown(event.originalEvent);
      break;
    }
  }

  findNextItem(el) {
    return el.nextElementSibling;
  }

  findPrevItem(el) {
    return el.previousElementSibling
  }

  ngOnDestroy() {
    this.hideList();
  }

  search(event) {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout)
    }
    this.searchTimeout = setTimeout( () => {
      let value = event.target.value;
      this.searchInput = value;
      this.renderedOptions = []
      if (value) {
        if (this.field) {
          for (let i=0; i<this.options.length; i++) {
            if (ObjectHelper.resolveFieldData(this.options[i], this.field).indexOf(value) != -1) {
              this.renderedOptions.push(this.options[i])
            }
          }
        } else {
          for (let i=0; i<this.options.length; i++) {
            if (this.options[i].indexOf(value) != -1) {
              this.renderedOptions.push(this.options[i])
            }
          }
        }
      } else {
        this.renderedOptions = this.options.slice(0, this.options.length);
      }
      this.getIsAllChecked();
    }, 50)
  }

  getIsAllChecked() {
    let isAllChecked = true;
    if (!this.showSearch) {
      if (this.options.length != this.valuesSelected.length) {
        isAllChecked = false
      }
    } else {
      for (let i=0 ;i<this.renderedOptions.length; i++) {
        if (!this.isOptionSelected(this.renderedOptions[i])) {
          isAllChecked = false;
          break;
        }
      }
    }
    this.allChecked = this.renderedOptions.length && isAllChecked;
    this.cd.detectChanges();
  }

  escapeKeydown(event) {
    this.hideList();
    this.focusInput();
    event.preventDefault();
  }

  handleInputKeydown(event) {
    if (this.overlayVisible) {
      if (event.which == 9 && !event.shiftKey) {
        if (this.showSearch) {
          this.selectAll.nativeElement.children[0].focus();
        } else {
          this.selectAll.nativeElement.focus();
        }
        event.preventDefault();
      }
      if (event.which == 40 && !this.showSearch) {
        this.selectAll.nativeElement.focus();
        event.preventDefault();
      }
    }
    if (event.which == 32 ) {
      this.toggleOpen();
      event.preventDefault();
    }
  }

  handleAllCheckboxKeydown(event) {
    if (event.shiftKey && event.which == 9) {
      this.focusInput();
      event.preventDefault();
    }
    if (!this.showSearch && event.which == 40) {

    }
    if (event.which == 13) {
      if (!this.selectionLimit)
        this.allClicked();
      event.preventDefault();
    }
  }

  goToPrevious() {
    if (this.showSearch) {
      this.focusSearchInput();
    } else {
      this.selectAll.nativeElement.focus();
    }
  }

  focusInput() {
    this.el.nativeElement.children[0].firstChild.focus();
  }

  focusSearchInput() {
    this.inputSearch.nativeElement.focus();
  }


  @HostListener('window: resize') 
  handleResize() {
    if (this.overlayVisible) {
      this.calculateLeftAndTopPosition();
    }
  }

}
