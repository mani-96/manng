import { TestBed } from '@angular/core/testing';

import { ManngComponentsService } from './manng-components.service';

describe('ManngComponentsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ManngComponentsService = TestBed.get(ManngComponentsService);
    expect(service).toBeTruthy();
  });
});
