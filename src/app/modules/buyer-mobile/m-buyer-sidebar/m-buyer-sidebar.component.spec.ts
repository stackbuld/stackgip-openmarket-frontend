import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MBuyerSidebarComponent } from './m-buyer-sidebar.component';

describe('MBuyerSidebarComponent', () => {
  let component: MBuyerSidebarComponent;
  let fixture: ComponentFixture<MBuyerSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MBuyerSidebarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MBuyerSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
