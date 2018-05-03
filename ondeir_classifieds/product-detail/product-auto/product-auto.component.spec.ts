import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductAutoComponent } from './product-auto.component';

describe('ProductAutoComponent', () => {
  let component: ProductAutoComponent;
  let fixture: ComponentFixture<ProductAutoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductAutoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductAutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
