import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeSingleProductComponent } from './single-product.component';

describe('HomeSingleProductComponent', () => {
  let component: HomeSingleProductComponent;
  let fixture: ComponentFixture<HomeSingleProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeSingleProductComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeSingleProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
