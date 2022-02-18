import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, FormArray, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';

export interface Config {
  length: number;
  allowNumbersOnly?: boolean;
  isPasswordInput?: boolean;
  containerClass?: string;
  placeholder?: string;
  inputClass?: string
}

const formValueAccessor = {
  provide: NG_VALUE_ACCESSOR,
  multi: true,
  useExisting: forwardRef(() => OtpComponent)
};

@Component({
  selector: 'man-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss'],
  providers: [formValueAccessor]
})
export class OtpComponent implements OnInit, ControlValueAccessor {

  @Input('config')
  config: Config = { length: 4 }

  @Input('disabled')
  disabled: boolean = false

  @Output()
  onInputChange: EventEmitter<any> = new EventEmitter();

  componentId = Math.random().toString(36).substring(2) + new Date().getTime().toString(36);

  inputType: string = 'text';

  formGroup: FormGroup = new FormGroup({
    formArray: new FormArray([])
  })

  modelChanged: any = () => { }
  touched: any = () => { };

  constructor() { }

  ngOnInit() {
    this.inputType = this.config.isPasswordInput ? 'password' :
      this.config.allowNumbersOnly ? 'tel' : 'text';
    for (let i = 0; i < this.config.length; i++) {
      (this.formGroup.get('formArray') as FormArray).push(new FormControl('', Validators.required))
    }
  }

  writeValue(value) {
    if (!value) {
      return;
    }
    this.createValue(value);
  }

  registerOnChange(fn) {
    this.modelChanged = fn;
  }

  registerOnTouched(fn) {
    this.touched = fn;
  }

  setDisabledState(val: boolean) {
    this.disabled = val;
  }

  onKeyDown(event: any) {
    // space
    if (this.checkKeyCode(event, 32)) {
      this.stopEvent(event)
    }
    if (this.config.allowNumbersOnly && this.notNumbers(event) && this.notMovementKey(event)) {
      this.stopEvent(event)
    }
    // value present
    if (event.target.value && this.notMovementKey(event)) {
      if (this.config.allowNumbersOnly && this.notNumbers(event)) return
      let current = parseInt(event.target.id.split('_')[1]);
      this.stopEvent(event)
      let next = this.getIdFromIndex(current + 1);
      let control = this.formArray.get('' + (current + 1));
      if (control && event.key.length == 1)
        control.setValue(event.key)
      this.setSelected(next);
    }
  }

  notNumbers(event) {
    return !((event.keyCode >= 96 && event.keyCode <= 105)
      || (event.keyCode >= 48 && event.keyCode <= 57))
  }

  notMovementKey(event) {
    return !this.isDeleteEvent(event) && !this.checkKeyCode(event, 37) &&
      !this.checkKeyCode(event, 39) && !this.checkKeyCode(event, 9) &&
      !(event.ctrlKey && event.key == 'v')
  }

  checkKeyCode(event, keycode) {
    const key = event.keyCode || event.charCode;
    return key == keycode ? true : false;
  }

  get formArray(): FormArray {
    return this.formGroup.get('formArray') as FormArray
  }

  stopEvent(event: any) {
    event.stopImmediatePropagation();
    event.preventDefault();
    return false;
  }

  onKeyUp(event, inputIdx) {
    let nextId = this.getIdFromIndex(inputIdx + 1);
    let previousId = this.getIdFromIndex(inputIdx - 1);

    if (this.checkKeyCode(event, 37)) {
      // left arrow key
      this.setSelected(previousId);
      return;
    }
    if (this.checkKeyCode(event, 39)) {
      // right arrow key
      this.setSelected(nextId);
      return;
    }
    if (this.isDeleteEvent(event) && !event.target.value) {
      // go to previous box
      this.buildValue();
      this.setSelected(previousId);
      return;
    }
    if (!event.target.value) return;

    if (this.isValidEntry(event)) {
      // move to next
      this.setSelected(nextId);
    }
    this.buildValue();
  }

  getIdFromIndex(index): string {
    return `otp_${index}_${this.componentId}`
  }

  isDeleteEvent(event) {
    return (
      event.key === 'Backspace' || event.key === 'Delete' ||
      this.checkKeyCode(event, 8) || this.checkKeyCode(event, 46)
    );
  }

  setSelected(id: string) {
    let el = (document.getElementById(id) as HTMLInputElement);
    if (!el) return
    el.focus();
    if (el.setSelectionRange) {
      setTimeout(() => {
        el.setSelectionRange(0, 1)
      }, 0)
    }
  }

  isValidEntry(event) {
    const inp = String.fromCharCode(event.keyCode);
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    return (
      isMobile ||
      /[a-zA-Z0-9-_]/.test(inp) || (event.keyCode >= 96 && event.keyCode <= 105)
    );
  }

  buildValue() {
    let value = '';
    const values = this.formArray.value;
    for (let i = 0; i < values.length; i++) {
      value += values[i] || ''
    }
    this.onInputChange.emit({
      parsed: value,
      raw: values
    })
    this.modelChanged(value)
  }

  handlePaste(event) {
    let data = '';
    let clipboardData = event.clipboardData || window['clipboardData'];
    if (clipboardData) {
      data = clipboardData.getData('Text');
    }
    event.stopImmediatePropagation();
    event.preventDefault();
    if (!data) {
      return;
    }
    this.createValue(data)
  }

  createValue(value: string) {
    value = value.toString().replace(/\s/g, '');
    // set value in control
    this.formGroup.reset();
    for (let i = 0; i < this.formArray.length; i++) {
      this.formArray.get('' + i).setValue(value[i]);
    }
    let index = value.length == this.formArray.length ? (value.length - 1) :
      value.length > this.formArray.length ? (this.formArray.length - 1) : (value.length - 1)
    this.setSelected(this.getIdFromIndex(index));
  }


}
