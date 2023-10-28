import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplimentaryProductsComponent } from './complimentary-products.component';

describe('ComplimentaryProductsComponent', () => {
  let component: ComplimentaryProductsComponent;
  let fixture: ComponentFixture<ComplimentaryProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplimentaryProductsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComplimentaryProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
