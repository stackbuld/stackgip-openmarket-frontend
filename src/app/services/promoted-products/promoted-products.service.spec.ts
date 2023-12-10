import { TestBed } from '@angular/core/testing';

import { PromotedProductsService } from './promoted-products.service';

describe('PromotedProductsService', () => {
  let service: PromotedProductsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PromotedProductsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
