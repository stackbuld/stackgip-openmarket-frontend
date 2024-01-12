import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MBuyerPersonalInformationComponent } from './m-buyer-personal-information.component';

describe('MBuyerPersonalInformationComponent', () => {
  let component: MBuyerPersonalInformationComponent;
  let fixture: ComponentFixture<MBuyerPersonalInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MBuyerPersonalInformationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MBuyerPersonalInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
