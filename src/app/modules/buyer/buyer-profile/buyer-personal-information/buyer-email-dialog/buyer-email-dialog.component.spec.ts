import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerEmailDialogComponent } from './buyer-email-dialog.component';

describe('BuyerEmailDialogComponent', () => {
  let component: BuyerEmailDialogComponent;
  let fixture: ComponentFixture<BuyerEmailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyerEmailDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyerEmailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
