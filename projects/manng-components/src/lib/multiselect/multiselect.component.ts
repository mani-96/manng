import { Component, OnInit, forwardRef, Input, ElementRef, ChangeDetectionStrategy, Renderer2, ViewEncapsulation, ChangeDetectorRef, HostListener, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { UtilServices } from '../util.service';

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
    
  @Input('options')
  options: Array<any>;
  
  @Input('field')
  field: string;

  @Input('scrollHeight')
  scrollHeight = 200;

  @Input('disable')
  disabled;

  @Input('showSearch')
  showSearch = false;

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

  constructor(private el: ElementRef, private cd: ChangeDetectorRef, private renderer: Renderer2, private serv: UtilServices) { }
    
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
    if (this.disabled) {
      return;
    }
    this.touched();
    if (!this.overlayVisible) { 
      this.overlayVisible = true;
      this.calculatedMaxHeight = this.scrollHeight;
      (this.el.nativeElement.children[0] as HTMLElement).classList.add('hide-panel');
      this.show();
      this.bindClickEventListener();
    } else {
      this.hideList();
    } 
  }

  show() {
    setTimeout( () => {
      if (!this.panel) {
        let el = this.el.nativeElement.children[0] as HTMLElement;
        if (el.getElementsByTagName('ul')[0]) {
          this.panel = el.getElementsByTagName('ul')[0];
        }
      }
      this.calculateLeftAndTopPosition();
      document.body.appendChild(this.panel);
      (this.el.nativeElement.children[0] as HTMLElement).classList.remove('hide-panel');
      this.cd.detectChanges();
      if (!this.showSearch) {
        this.panel.firstChild.focus();
      }
    }, 0)
  }

  calculateLeftAndTopPosition() {
    let elProp = this.el.nativeElement.children[0].getBoundingClientRect();
    this.width = elProp.width;
    let panelHeight = this.panel.getBoundingClientRect().height;
    let posYHeight = elProp.bottom + panelHeight;
    this.left = elProp.x + this.serv.getWindowScrollLeft();
    if (posYHeight < window.innerHeight) {
      this.top = elProp.bottom;
    } else {
      if (elProp.y > panelHeight + 1) {
        this.top = elProp.y + this.serv.getWindowScrollTop() - panelHeight - 1;
      } else {
        let top = elProp.y;
        let bottom = window.innerHeight - elProp.y - elProp.height;
        if (top > bottom) {
          this.calculatedMaxHeight = top - 1;
          this.top = elProp.y + this.serv.getWindowScrollTop() - (this.calculatedMaxHeight > panelHeight ? panelHeight : this.calculatedMaxHeight)  - 1;
        } else {
          this.calculatedMaxHeight = bottom;
          this.top = elProp.y + + this.serv.getWindowScrollTop() + elProp.height;
        }
      }
    }
  }

  hideList() {
    this.overlayVisible = false;
    this.panel = null;
    (this.el.nativeElement.children[0] as HTMLElement).classList.remove('hide-panel');
    this.unbindClickEventListener();
    this.cd.detectChanges();
  }

  allClicked(event) {
    if (event.target.parentElement) {
      event.target.parentElement.focus();
    }
    if (event.target.checked) { 
      this.checkAll(); 
    } else { 
      this.uncheckAll(); 
    } 
  } 

  checkAll() { 
    this.allChecked = true;
    if (!this.showSearch) {
      this.valuesSelected = this.options.slice(0, this.options.length);
    } else {
      for (let i=0; i<this.renderedOptions.length; i++) {
        if (!this.isOptionSelected(this.renderedOptions[i])) {
          this.valuesSelected.push(this.renderedOptions[i])
        }
      }
    }
    this.setInputValueOnCheck();
  } 

  uncheckAll() { 
    if (!this.showSearch) {
      this.valuesSelected = [];
      this.inputValue = '';
      this.cd.detectChanges();
    } else {
      let index;
      for (let i=0; i<this.renderedOptions.length; i++) {
        index = this.getSelectedOptionIndex(this.renderedOptions[i])
        if (index >= 0) {
          this.valuesSelected.splice(index)
        }
      }
      this.setInputValueOnCheck();
    }
    this.allChecked = false; 
    this.modelChanged(null);
  } 

  optionClicked(event, value) {
    if (event && event.target.parentElement) {
      event.target.parentElement.focus();
    }
    let selectedIndex = this.getSelectedOptionIndex(value)
    if (selectedIndex >= 0) {
      this.valuesSelected.splice(selectedIndex)
    } else {
      this.valuesSelected.push(value);
    }
    this.setInputValueOnCheck();
    this.getIsAllChecked();
  }

  isOptionSelected(option) {
    return this.getSelectedOptionIndex(option) >= 0;
  }

  getSelectedOptionIndex(option) {
    let index = -1
    for (let i=0; i<this.valuesSelected.length; i++) {
      if (this.serv.isObjectequal(this.valuesSelected[i], option, this.field)) {
        index = i;
        break;
      }
    }
    return index;
  }

  getOptionValue(option) {
    if (!this.field) {
      return option
    } else {
      option[this.field]
    }
  }
  
  setInputValueOnCheck() { 
    let filtered: Array<any> = this.valuesSelected
    this.allChecked = false; 
    if (filtered.length > 0) {
      if (!this.field) {
        this.inputValue = filtered.length == 1 ? filtered[0] : (filtered.length + ' items selected');
      } else {
        this.inputValue = filtered.length == 1 ? filtered[0][this.field] :(filtered.length + ' items selected');
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
            if (this.panel && !this.panel.contains(event.target)) {
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
    switch(event.which) {
      //down
      case 40:
          let nextItem = this.findNextItem(event.target);
          if (nextItem) {
              nextItem.focus();
          }
          event.preventDefault();
      break;

      //up
      case 38:
          let prevItem = this.findPrevItem(event.target);
          if (prevItem) {
              prevItem.focus();
          }

          event.preventDefault();
      break;

      //enter
      case 13:
      if (index == 'all') {
        this.allChecked ? this.allClicked({target: {checked: false}}) : this.allClicked({target: {checked: true}})
      } else { 
        this.optionClicked('', option)
      }           
      break;

      //esc
      case 27:
      this.hideList();          
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
    let value = event.target.value;
    this.renderedOptions = []
    if (value) {
      if (this.field) {
        for (let i=0; i<this.options.length; i++) {
          if (this.serv.resolveFieldData(this.options[i], this.field).indexOf(value) != -1) {
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
    this.allChecked = isAllChecked;
    this.cd.detectChanges();
  }


  @HostListener('window: resize') 
  handleResize() {
    if (this.overlayVisible) {
      this.calculateLeftAndTopPosition();
    }
  }

}
