import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectTypeRegisterComponent } from './select-type-register.component';

describe('SelectTypeRegisterComponent', () => {
  let component: SelectTypeRegisterComponent;
  let fixture: ComponentFixture<SelectTypeRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectTypeRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectTypeRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
