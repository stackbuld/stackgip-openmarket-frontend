import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerSecuritySettingsComponent } from './buyer-security-settings.component';

describe('BuyerSecuritySettingsComponent', () => {
  let component: BuyerSecuritySettingsComponent;
  let fixture: ComponentFixture<BuyerSecuritySettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyerSecuritySettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyerSecuritySettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
