import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarHeaderDisplayComponent } from './sidebar-header-display.component';

describe('SidebarHeaderDisplayComponent', () => {
  let component: SidebarHeaderDisplayComponent;
  let fixture: ComponentFixture<SidebarHeaderDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidebarHeaderDisplayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarHeaderDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
