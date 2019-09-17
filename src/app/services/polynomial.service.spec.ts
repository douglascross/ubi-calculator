import { TestBed } from '@angular/core/testing';

import { PolynomialService } from './polynomial.service';

describe('PolynomialService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PolynomialService = TestBed.get(PolynomialService);
    expect(service).toBeTruthy();
  });
});
