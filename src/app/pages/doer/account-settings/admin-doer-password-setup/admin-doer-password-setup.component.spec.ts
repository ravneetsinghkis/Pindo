import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDoerPasswordSetupComponent } from './admin-doer-password-setup.component';

describe('AdminDoerPasswordSetupComponent', () => {
  let component: AdminDoerPasswordSetupComponent;
  let fixture: ComponentFixture<AdminDoerPasswordSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminDoerPasswordSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDoerPasswordSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
