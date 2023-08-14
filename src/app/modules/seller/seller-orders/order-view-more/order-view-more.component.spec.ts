import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderViewMoreComponent } from './order-view-more.component';

describe('OrderViewMoreComponent', () => {
  let component: OrderViewMoreComponent;
  let fixture: ComponentFixture<OrderViewMoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderViewMoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderViewMoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
