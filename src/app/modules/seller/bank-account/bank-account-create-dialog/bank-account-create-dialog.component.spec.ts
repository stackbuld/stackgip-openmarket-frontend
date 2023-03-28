import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankAccountCreateDialogComponent } from './bank-account-create-dialog.component';

describe('BankAccountCreateDialogComponent', () => {
  let component: BankAccountCreateDialogComponent;
  let fixture: ComponentFixture<BankAccountCreateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankAccountCreateDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankAccountCreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
