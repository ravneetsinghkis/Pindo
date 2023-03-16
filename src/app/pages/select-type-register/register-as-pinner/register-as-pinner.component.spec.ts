import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterAsPinnerComponent } from './register-as-pinner.component';

describe('RegisterAsPinnerComponent', () => {
  let component: RegisterAsPinnerComponent;
  let fixture: ComponentFixture<RegisterAsPinnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterAsPinnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterAsPinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
