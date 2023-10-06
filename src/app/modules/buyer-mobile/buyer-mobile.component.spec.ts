import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerMobileComponent } from './buyer-mobile.component';

describe('BuyerMobileComponent', () => {
  let component: BuyerMobileComponent;
  let fixture: ComponentFixture<BuyerMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyerMobileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyerMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
