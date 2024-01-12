import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerNavComponent } from './buyer-nav.component';

describe('BuyerNavComponent', () => {
  let component: BuyerNavComponent;
  let fixture: ComponentFixture<BuyerNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyerNavComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyerNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
