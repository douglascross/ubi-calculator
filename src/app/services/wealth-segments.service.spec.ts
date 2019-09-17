import { TestBed } from '@angular/core/testing';

import { WealthSegmentsService } from './wealth-segments.service';

describe('WealthSegmentsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WealthSegmentsService = TestBed.get(WealthSegmentsService);
    expect(service).toBeTruthy();
  });
});
