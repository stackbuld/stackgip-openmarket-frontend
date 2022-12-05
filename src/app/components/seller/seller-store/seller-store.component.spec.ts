import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerStoreComponent } from './seller-store.component';

describe('SellerProductComponent', () => {
  let component: SellerStoreComponent;
  let fixture: ComponentFixture<SellerStoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellerStoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellerStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
