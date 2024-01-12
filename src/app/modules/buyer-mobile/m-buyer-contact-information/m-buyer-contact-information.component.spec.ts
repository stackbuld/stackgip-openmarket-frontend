import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MBuyerContactInformationComponent } from './m-buyer-contact-information.component';

describe('MBuyerContactInformationComponent', () => {
  let component: MBuyerContactInformationComponent;
  let fixture: ComponentFixture<MBuyerContactInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MBuyerContactInformationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MBuyerContactInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
