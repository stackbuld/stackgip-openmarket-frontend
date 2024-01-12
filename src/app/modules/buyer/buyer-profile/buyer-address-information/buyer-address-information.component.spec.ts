import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerAddressInformationComponent } from './buyer-address-information.component';

describe('BuyerAddressInformationComponent', () => {
  let component: BuyerAddressInformationComponent;
  let fixture: ComponentFixture<BuyerAddressInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyerAddressInformationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyerAddressInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
