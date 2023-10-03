import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerChangePasswordComponent } from './buyer-change-password.component';

describe('BuyerChangePasswordComponent', () => {
  let component: BuyerChangePasswordComponent;
  let fixture: ComponentFixture<BuyerChangePasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyerChangePasswordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyerChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
