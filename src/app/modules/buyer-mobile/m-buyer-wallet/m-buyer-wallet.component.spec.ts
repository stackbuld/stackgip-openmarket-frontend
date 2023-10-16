import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MBuyerWalletComponent } from './m-buyer-wallet.component';

describe('MBuyerWalletComponent', () => {
  let component: MBuyerWalletComponent;
  let fixture: ComponentFixture<MBuyerWalletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MBuyerWalletComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MBuyerWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
