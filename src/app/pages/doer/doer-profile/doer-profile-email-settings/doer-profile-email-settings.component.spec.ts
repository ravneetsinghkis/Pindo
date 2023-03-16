import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoerProfileEmailSettingsComponent } from './doer-profile-email-settings.component';

describe('DoerProfileEmailSettingsComponent', () => {
  let component: DoerProfileEmailSettingsComponent;
  let fixture: ComponentFixture<DoerProfileEmailSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoerProfileEmailSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoerProfileEmailSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
