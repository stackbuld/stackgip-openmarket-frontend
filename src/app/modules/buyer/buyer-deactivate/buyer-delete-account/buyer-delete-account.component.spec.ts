import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerDeleteAccountComponent } from './buyer-delete-account.component';

describe('BuyerDeleteAccountComponent', () => {
  let component: BuyerDeleteAccountComponent;
  let fixture: ComponentFixture<BuyerDeleteAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyerDeleteAccountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyerDeleteAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
