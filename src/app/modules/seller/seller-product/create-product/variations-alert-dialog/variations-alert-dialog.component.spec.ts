import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariationsAlertDialogComponentComponent } from './variations-alert-dialog.component';

describe('VariationsAlertDialogComponentComponent', () => {
  let component: VariationsAlertDialogComponentComponent;
  let fixture: ComponentFixture<VariationsAlertDialogComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VariationsAlertDialogComponentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VariationsAlertDialogComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
