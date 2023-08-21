import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryCodesDropdownComponent } from './countrycodes-dropdown.component';

describe('CountryCodesDropdownComponent', () => {
  let component: CountryCodesDropdownComponent;
  let fixture: ComponentFixture<CountryCodesDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CountryCodesDropdownComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CountryCodesDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
