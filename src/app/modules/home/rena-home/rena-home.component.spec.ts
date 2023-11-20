import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenaHomeComponent } from './rena-home.component';

describe('RenaHomeComponent', () => {
  let component: RenaHomeComponent;
  let fixture: ComponentFixture<RenaHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RenaHomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RenaHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
