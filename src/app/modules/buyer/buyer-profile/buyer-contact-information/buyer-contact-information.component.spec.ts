import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerContactInformationComponent } from './buyer-contact-information.component';

describe('BuyerContactInformationComponent', () => {
  let component: BuyerContactInformationComponent;
  let fixture: ComponentFixture<BuyerContactInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyerContactInformationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyerContactInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
