import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerSecurityOtpComponent } from './buyer-security-otp.component';

describe('BuyerSecurityOtpComponent', () => {
  let component: BuyerSecurityOtpComponent;
  let fixture: ComponentFixture<BuyerSecurityOtpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyerSecurityOtpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyerSecurityOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
