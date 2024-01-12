import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MBuyerPinSettingsComponent } from './m-buyer-pin-settings.component';

describe('MBuyerPinSettingsComponent', () => {
  let component: MBuyerPinSettingsComponent;
  let fixture: ComponentFixture<MBuyerPinSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MBuyerPinSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MBuyerPinSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
