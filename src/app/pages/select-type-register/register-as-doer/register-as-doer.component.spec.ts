import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterAsDoerComponent } from './register-as-doer.component';

describe('RegisterAsDoerComponent', () => {
  let component: RegisterAsDoerComponent;
  let fixture: ComponentFixture<RegisterAsDoerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterAsDoerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterAsDoerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
