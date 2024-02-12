import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletKycPromptComponent } from './wallet-kyc-prompt.component';

describe('WalletKycPromptComponent', () => {
  let component: WalletKycPromptComponent;
  let fixture: ComponentFixture<WalletKycPromptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WalletKycPromptComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WalletKycPromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
