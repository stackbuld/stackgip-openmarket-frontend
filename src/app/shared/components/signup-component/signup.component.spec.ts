import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupModalComponent } from './signup.component';

describe('SignupModalComponent', () => {
  let component: SignupModalComponent;
  let fixture: ComponentFixture<SignupModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignupModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignupModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
