import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestRefundModalComponent } from './request-refund-modal.component';

describe('RequestRefundModalComponent', () => {
  let component: RequestRefundModalComponent;
  let fixture: ComponentFixture<RequestRefundModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestRefundModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestRefundModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
