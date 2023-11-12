import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerStorefrontComponent } from './seller-storefront.component';

describe('SellerStorefrontComponent', () => {
  let component: SellerStorefrontComponent;
  let fixture: ComponentFixture<SellerStorefrontComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellerStorefrontComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerStorefrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
