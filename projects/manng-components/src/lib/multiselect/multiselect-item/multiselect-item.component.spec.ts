import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiselectItemComponent } from './multiselect-item.component';

describe('MultiselectItemComponent', () => {
  let component: MultiselectItemComponent;
  let fixture: ComponentFixture<MultiselectItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiselectItemComponent ]
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
});
