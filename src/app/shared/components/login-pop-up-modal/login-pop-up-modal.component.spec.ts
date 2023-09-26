import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginPopUpModalComponent } from './login-pop-up-modal.component';

describe('LoginPopUpModalComponent', () => {
  let component: LoginPopUpModalComponent;
  let fixture: ComponentFixture<LoginPopUpModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginPopUpModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginPopUpModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
