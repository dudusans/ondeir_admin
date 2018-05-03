import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductEstatesComponent } from './product-estates.component';

describe('ProductEstatesComponent', () => {
  let component: ProductEstatesComponent;
  let fixture: ComponentFixture<ProductEstatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductEstatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductEstatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
