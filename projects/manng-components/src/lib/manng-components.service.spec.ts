import { TestBed } from '@angular/core/testing';

import { UtilServices } from './util.service';

describe('ManngComponentsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UtilServices = TestBed.get(UtilServices);
    expect(service).toBeTruthy();
  });
});
