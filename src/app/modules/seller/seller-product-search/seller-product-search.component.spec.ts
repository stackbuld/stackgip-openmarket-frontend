import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerProductSearchComponent } from './seller-product-search.component';

describe('SellerProductSearchComponent', () => {
  let component: SellerProductSearchComponent;
  let fixture: ComponentFixture<SellerProductSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellerProductSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerProductSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
