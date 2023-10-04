import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerDeactivateComponent } from './buyer-deactivate.component';

describe('BuyerDeactivateComponent', () => {
  let component: BuyerDeactivateComponent;
  let fixture: ComponentFixture<BuyerDeactivateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyerDeactivateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyerDeactivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
