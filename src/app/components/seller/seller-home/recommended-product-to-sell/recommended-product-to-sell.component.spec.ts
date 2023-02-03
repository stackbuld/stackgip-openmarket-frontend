import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendedProductToSellComponent } from './recommended-product-to-sell.component';

describe('RecommendedProductToSellComponent', () => {
  let component: RecommendedProductToSellComponent;
  let fixture: ComponentFixture<RecommendedProductToSellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecommendedProductToSellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecommendedProductToSellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
