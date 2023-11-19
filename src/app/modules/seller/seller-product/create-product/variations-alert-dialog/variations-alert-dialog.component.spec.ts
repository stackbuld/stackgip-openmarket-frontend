import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariationsAlertDialogComponent } from './variations-alert-dialog.component';

describe('VariationsAlertDialogComponent', () => {
  let component: VariationsAlertDialogComponent;
  let fixture: ComponentFixture<VariationsAlertDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VariationsAlertDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VariationsAlertDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
