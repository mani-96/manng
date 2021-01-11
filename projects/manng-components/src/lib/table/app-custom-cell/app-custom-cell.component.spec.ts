import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppCustomCellComponent } from './app-custom-cell.component';
import { RenderedCellComponent } from '../rendered-cell/rendered-cell.component';

describe('AppCustomCellComponent', () => {
  let component: AppCustomCellComponent;
  let fixture: ComponentFixture<AppCustomCellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppCustomCellComponent, RenderedCellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppCustomCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
