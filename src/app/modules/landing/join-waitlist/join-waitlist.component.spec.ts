import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinWaitlistComponent } from './join-waitlist.component';

describe('JoinWaitlistComponent', () => {
  let component: JoinWaitlistComponent;
  let fixture: ComponentFixture<JoinWaitlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JoinWaitlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinWaitlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
