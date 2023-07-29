import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialModalComponent } from './social-modal.component';

describe('SocialModalComponent', () => {
  let component: SocialModalComponent;
  let fixture: ComponentFixture<SocialModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SocialModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SocialModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
