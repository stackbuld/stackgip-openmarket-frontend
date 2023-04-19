import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerStoreCreateDialogComponent } from './seller-store-create-dialog.component';

describe('SellerStoreCreateDialogComponent', () => {
  let component: SellerStoreCreateDialogComponent;
  let fixture: ComponentFixture<SellerStoreCreateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellerStoreCreateDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerStoreCreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
