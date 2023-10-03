import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerPersonalInformationComponent } from './buyer-personal-information.component';

describe('BuyerPersonalInformationComponent', () => {
  let component: BuyerPersonalInformationComponent;
  let fixture: ComponentFixture<BuyerPersonalInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyerPersonalInformationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyerPersonalInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
