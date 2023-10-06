import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MBuyerAddressInformationComponent } from './m-buyer-address-information.component';

describe('MBuyerAddressInformationComponent', () => {
  let component: MBuyerAddressInformationComponent;
  let fixture: ComponentFixture<MBuyerAddressInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MBuyerAddressInformationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MBuyerAddressInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
