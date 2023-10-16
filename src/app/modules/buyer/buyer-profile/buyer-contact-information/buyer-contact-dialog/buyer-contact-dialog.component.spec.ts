import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerContactDialogComponent } from './buyer-contact-dialog.component';

describe('BuyerContactDialogComponent', () => {
  let component: BuyerContactDialogComponent;
  let fixture: ComponentFixture<BuyerContactDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyerContactDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyerContactDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
