import { TestBed } from '@angular/core/testing';

import { SellerStorefrontService } from './seller-storefront.service';

describe('SellerStorefrontService', () => {
  let service: SellerStorefrontService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SellerStorefrontService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
