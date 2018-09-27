import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCarsDetailsComponent } from './list-cars-details.component';

describe('ListCarsDetailsComponent', () => {
  let component: ListCarsDetailsComponent;
  let fixture: ComponentFixture<ListCarsDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListCarsDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCarsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
