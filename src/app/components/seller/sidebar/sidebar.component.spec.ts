import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerSidebarComponent } from './sidebar.component';

describe('SellerSidebarComponent', () => {
  let component: SellerSidebarComponent;
  let fixture: ComponentFixture<SellerSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellerSidebarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SellerSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
