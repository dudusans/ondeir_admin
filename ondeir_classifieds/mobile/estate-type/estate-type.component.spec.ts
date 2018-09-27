import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstateTypeComponent } from './estate-type.component';

describe('EstateTypeComponent', () => {
  let component: EstateTypeComponent;
  let fixture: ComponentFixture<EstateTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstateTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstateTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
