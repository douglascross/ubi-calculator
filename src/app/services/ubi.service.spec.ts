import { TestBed } from '@angular/core/testing';

import { UbiService } from './ubi.service';

describe('WealthTaxServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UbiService = TestBed.get(UbiService);
    expect(service).toBeTruthy();
  });
});
