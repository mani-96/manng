import { Component, OnInit, forwardRef, Input, ElementRef, ChangeDetectionStrategy, Renderer2, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

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
  options: Array<any> = [];

  @Input('field')
  field: string;

  @Input('scrollHeight')
  scrollHeight = 200;
    
  selectedValues = {};
  allChecked = false;
  width = 100;
  overlayVisible = false;
  documentClickListener;
  top;
  left;
  calculatedMaxHeight;
  panel

  constructor(private el: ElementRef, private cd: ChangeDetectorRef, private renderer: Renderer2) { }
    
  modelChanged: any = () => {}
  touched: any = () => {}
    
  inputValue = '';
    
  ngOnInit() {}
    
  writeValue(value) {
    this.allChecked = false;
    if (typeof value == 'string') {
      for (let i=0; i<this.options.length; i++) { 
        if (this.options[i] == value) { 
          this.inputValue = value;
          this.selectedValues[i] = value; 
          break; 
        } 
      } 
    } else { 
      for (let i=0; i<this.options.length; i++) { 
        for (let j=0; j<value.length; j++) { 
          if (JSON.stringify(this.options[i]) == JSON.stringify(value[j])) {
            this.selectedValues[i]=this.options[i]; 
          } 
        } 
      } 
      if (value.length == this.options.length) { 
        this.allChecked=true 
      } 
    } 
  } 

  registerOnChange(fn) { 
    this.modelChanged = fn; 
  } 

  registerOnTouched(fn) { 
    this.touched= fn; 
  }

  allClicked(event) {
    if (event.target.checked) { 
      this.checkAll(); 
    } else { 
      this.uncheckAll(); 
    } 
  } 

  toggleOpen() {
    this.touched();
    if (!this.overlayVisible) { 
      this.overlayVisible = true;
      this.calculatedMaxHeight = this.scrollHeight;
      (this.el.nativeElement.children[0] as HTMLElement).classList.add('hide-panel');
      this.getTopPositionAndShow();
      this.bindClickEventListener();
    } else {
      this.hideList();
    } 
  }

  getTopPositionAndShow() {
    let elProp = this.el.nativeElement.children[0].getBoundingClientRect();
    this.width = elProp.width;
    setTimeout( () => {
      if (!this.panel) {
        this.panel = this.el.nativeElement.children[0].children[1];
      }
      let panelHeight = this.panel.getBoundingClientRect().height;
      let posYHeight = elProp.bottom + panelHeight;
      this.left = elProp.x + this.getWindowScrollLeft();
      if (posYHeight < window.innerHeight) {
        this.top = elProp.bottom;
      } else {
        if (elProp.y > panelHeight + 1) {
          this.top = elProp.y + this.getWindowScrollTop() - panelHeight - 1;
        } else {
          let top = window.innerHeight - elProp.y;
          let bottom = window.innerHeight - elProp.y - elProp.height;
          if (top > bottom) {
            this.calculatedMaxHeight = top - 1;
            this.top = elProp.y + this.getWindowScrollTop() - (this.calculatedMaxHeight > panelHeight ? panelHeight : this.calculatedMaxHeight)  - 1;
          } else {
            this.calculatedMaxHeight = bottom;
            this.top = elProp.y + + this.getWindowScrollTop() + elProp.height;
          }
        }
      }
      document.body.appendChild(this.panel);
      (this.el.nativeElement.children[0] as HTMLElement).classList.remove('hide-panel');
      this.cd.detectChanges();
    }, 0)
  }

  getWindowScrollTop() {
    let doc = document.documentElement;
    return (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
  }
  
  getWindowScrollLeft() {
    let doc = document.documentElement;
    return (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
  }

  hideList() {
    this.overlayVisible = false;
    this.panel = null;
    (this.el.nativeElement.children[0] as HTMLElement).classList.remove('hide-panel');
    this.unbindClickEventListener();
    this.cd.detectChanges();
  }

  checkAll() { 
    this.options.map( (key, index) => {
      this.selectedValues[index] = key;
    });
    this.setInputValueOnCheck();
  } 

  uncheckAll() { 
    this.selectedValues = {};
    this.inputValue = '';
    this.allChecked = false; 
    this.modelChanged(null);
    this.cd.detectChanges();
  } 

  optionClicked(event, i, value) { 
    if (event.target.checked) { 
      this.selectedValues[i] = value;
    } else { 
      delete this.selectedValues[i]; 
    }
    this.setInputValueOnCheck(); 
  } 

  getOptionValue(option) {
    if (typeof option == 'string') {
      return option
    } else {
      option[this.field]
    }
  }
  
  setInputValueOnCheck() { 
    let filtered: Array<any> = Object.values(this.selectedValues); 
    this.allChecked = false; 
    if (filtered.length > 0) {
      if (typeof filtered[0] == 'string') {
        this.inputValue = filtered.length == 1 ? filtered[0] : (filtered.length + ' items selected');
      } else {
        this.inputValue = filtered.length == 1 ? filtered[0][this.field] :(filtered.length + ' items selected');
      }
      if (filtered.length == this.options.length) {
        this.allChecked = true;
      }
      this.modelChanged(filtered);
    } else {
      this.inputValue = '';
      this.modelChanged(null);
    }
    this.cd.detectChanges();
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

  ngOnDestroy() {
    this.hideList();
  }

}
