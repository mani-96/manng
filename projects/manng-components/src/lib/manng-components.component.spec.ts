import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManngComponentsComponent } from './manng-components.component';

describe('ManngComponentsComponent', () => {
  let component: ManngComponentsComponent;
  let fixture: ComponentFixture<ManngComponentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManngComponentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManngComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
