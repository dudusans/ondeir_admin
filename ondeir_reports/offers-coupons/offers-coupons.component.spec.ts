import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OffersCouponsComponent } from './offers-coupons.component';

describe('OffersCouponsComponent', () => {
  let component: OffersCouponsComponent;
  let fixture: ComponentFixture<OffersCouponsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OffersCouponsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OffersCouponsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
