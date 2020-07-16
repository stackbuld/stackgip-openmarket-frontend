import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderProductsComponent } from './slider-products.component';

describe('SliderProductsComponent', () => {
  let component: SliderProductsComponent;
  let fixture: ComponentFixture<SliderProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SliderProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SliderProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
