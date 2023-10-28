import { TestBed } from '@angular/core/testing';

import { AlgProductsService } from './alg-products.service';

describe('AlgProductsService', () => {
  let service: AlgProductsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlgProductsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
