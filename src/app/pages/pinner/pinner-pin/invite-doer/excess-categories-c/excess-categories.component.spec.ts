import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcessCategoriesComponent } from './excess-categories.component';

describe('ExcessCategoriesComponent', () => {
  let component: ExcessCategoriesComponent;
  let fixture: ComponentFixture<ExcessCategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExcessCategoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExcessCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
