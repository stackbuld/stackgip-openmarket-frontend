import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerShowCaseProductComponent } from './seller-show-case-product.component';

describe('SellerShowCaseProductComponent', () => {
  let component: SellerShowCaseProductComponent;
  let fixture: ComponentFixture<SellerShowCaseProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellerShowCaseProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellerShowCaseProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
