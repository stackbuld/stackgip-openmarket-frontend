import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LockedFundsComponent } from './locked-funds.component';

describe('LockedFundsComponent', () => {
  let component: LockedFundsComponent;
  let fixture: ComponentFixture<LockedFundsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LockedFundsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LockedFundsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
