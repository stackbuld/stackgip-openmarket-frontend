import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MBuyerDeleteAccountComponent } from './m-buyer-delete-account.component';

describe('MBuyerDeleteAccountComponent', () => {
  let component: MBuyerDeleteAccountComponent;
  let fixture: ComponentFixture<MBuyerDeleteAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MBuyerDeleteAccountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MBuyerDeleteAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
