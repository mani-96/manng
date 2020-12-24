import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RenderedCellComponent } from './rendered-cell.component';

describe('RenderedCellComponent', () => {
  let component: RenderedCellComponent;
  let fixture: ComponentFixture<RenderedCellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RenderedCellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenderedCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
