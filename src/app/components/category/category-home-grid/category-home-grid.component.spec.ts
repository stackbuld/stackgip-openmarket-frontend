import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryHomeGridComponent } from './category-home-grid.component';

describe('CategoryHomeGridComponent', () => {
  let component: CategoryHomeGridComponent;
  let fixture: ComponentFixture<CategoryHomeGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoryHomeGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryHomeGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
