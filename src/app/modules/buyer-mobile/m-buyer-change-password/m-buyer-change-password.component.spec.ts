import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MBuyerChangePasswordComponent } from './m-buyer-change-password.component';

describe('MBuyerChangePasswordComponent', () => {
  let component: MBuyerChangePasswordComponent;
  let fixture: ComponentFixture<MBuyerChangePasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MBuyerChangePasswordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MBuyerChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
