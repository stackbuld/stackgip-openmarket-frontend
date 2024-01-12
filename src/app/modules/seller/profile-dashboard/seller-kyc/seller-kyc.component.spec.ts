import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerKycComponent } from './seller-kyc.component';

describe('SellerKycComponent', () => {
  let component: SellerKycComponent;
  let fixture: ComponentFixture<SellerKycComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellerKycComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerKycComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
