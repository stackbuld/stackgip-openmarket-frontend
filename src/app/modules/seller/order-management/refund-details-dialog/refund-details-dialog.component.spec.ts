import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundDetailsDialogComponent } from './refund-details-dialog.component';

describe('RefundDetailsDialogComponent', () => {
  let component: RefundDetailsDialogComponent;
  let fixture: ComponentFixture<RefundDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RefundDetailsDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RefundDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
