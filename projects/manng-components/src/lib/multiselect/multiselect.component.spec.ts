import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { MultiselectComponent } from './multiselect.component';
import { MultiselectItemComponent } from './multiselect-item/multiselect-item.component';
import { By } from '@angular/platform-browser';

describe('MultiselectComponent', () => {
  let component: MultiselectComponent;
  let fixture: ComponentFixture<MultiselectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MultiselectComponent, MultiselectItemComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiselectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call search method', () => {
    spyOn(component, 'search')
    let input = fixture.debugElement.query(By.css('input[type=text]'));
    let event = new Event('input', {
      bubbles: true,
      cancelable: true,
    });
    (input.nativeElement as HTMLInputElement).dispatchEvent(event);
    fixture.detectChanges();
    expect(component.search).toHaveBeenCalled()
  })

  it('should display correct search result with field value', fakeAsync(() => {
    component.field = 'value';
    component.options = [{
      value: 'Option 1'
    },
    {
      value: "Option 2"
    }]
    component.search({ target: { value: '2' } })
    tick(50)
    fixture.detectChanges();
    expect(component.renderedOptions.length).toBe(1)
  }))

  it('should display correct search result without field value', fakeAsync(() => {
    component.options = ['Option 1', 'Option 2']
    component.search({ target: { value: 'on' } })
    tick(50)
    fixture.detectChanges();
    expect(component.renderedOptions.length).toBe(2)
  }))

  it('should check if option is selected', () => {
    component.options = ['Option 1', 'Option 2'];
    component.valuesSelected = ['Option 1'];
    fixture.detectChanges()
    expect(component.isOptionSelected(component.options[0])).toBeTruthy()
  })

  it('should get selected option index', () => {
    component.options = ['Option 1', 'Option 2'];
    component.valuesSelected = ['Option 1'];
    fixture.detectChanges()
    expect(component.getSelectedOptionIndex(component.options[0])).toBe(0)
  })
  it('should uncheck all items', () => {
    spyOn(component.onSelect, 'emit')
    component.uncheckAll()
    fixture.detectChanges()
    expect(component.onSelect.emit).toHaveBeenCalledWith([])
  })
});