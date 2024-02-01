import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleProductAddressDialogComponent } from './single-product-address-dialog.component';

describe('SingleProductAddressDialogComponent', () => {
  let component: SingleProductAddressDialogComponent;
  let fixture: ComponentFixture<SingleProductAddressDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleProductAddressDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleProductAddressDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
