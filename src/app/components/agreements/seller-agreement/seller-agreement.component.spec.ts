import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerAgreementComponent } from './seller-agreement.component';

describe('SellerAgreementComponent', () => {
  let component: SellerAgreementComponent;
  let fixture: ComponentFixture<SellerAgreementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellerAgreementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellerAgreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
