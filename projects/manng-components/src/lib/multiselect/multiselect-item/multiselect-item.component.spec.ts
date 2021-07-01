import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { emitKeypressEvents } from 'readline';

import { MultiselectItemComponent } from './multiselect-item.component';

describe('MultiselectItemComponent', () => {
  let component: MultiselectItemComponent;
  let fixture: ComponentFixture<MultiselectItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MultiselectItemComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiselectItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should give correct option value when no field value is present', () => {
    let optionValue = 'Option Value';
    component.option = optionValue;
    expect(component.getOptionValue()).toBe('Option Value')
  })

  it('should give correct result when field is give', () => {
    let optionValue = {
      value: 'Option Value'
    }
    let field = 'value'
    component.option = optionValue;
    component.field = field;
    expect(component.getOptionValue()).toBe('Option Value')
  })

  it('should emit event when clicked', () => {
    component.option = 'Option value'
    component.isDisabled = false;
    spyOn(component.onOptionClick, 'emit')
    let li = fixture.debugElement.query(By.css('li'));
    li.nativeElement.click();
    fixture.detectChanges();
    expect(component.onOptionClick.emit).toHaveBeenCalled();
    expect(component.onOptionClick.emit).toHaveBeenCalledWith(component.option)
  })
  it('should not emit event when clicked and disabled', () => {
    component.option = 'Option value'
    component.isDisabled = true;
    spyOn(component.onOptionClick, 'emit')
    let li = fixture.debugElement.query(By.css('li'));
    li.nativeElement.click();
    fixture.detectChanges();
    expect(component.onOptionClick.emit).not.toHaveBeenCalled();
  })

  it('should emit event when keydown', () => {
    component.option = 'Option value'
    component.isDisabled = false;
    spyOn(component.onOptionKeydown, 'emit')
    let li = fixture.debugElement.query(By.css('li'));
    (li.nativeElement as HTMLLIElement).dispatchEvent(new KeyboardEvent("keydown", { key: 'ArrowDown' }));
    fixture.detectChanges();
    expect(component.onOptionKeydown.emit).toHaveBeenCalled()
  })
});
