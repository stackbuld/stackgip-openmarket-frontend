import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerPinSettingsComponent } from './buyer-pin-settings.component';

describe('BuyerPinSettingsComponent', () => {
  let component: BuyerPinSettingsComponent;
  let fixture: ComponentFixture<BuyerPinSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyerPinSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyerPinSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
