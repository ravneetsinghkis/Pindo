import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoerProfileNotificationSettingsComponent } from './doer-profile-notification-settings.component';

describe('DoerProfileNotificationSettingsComponent', () => {
  let component: DoerProfileNotificationSettingsComponent;
  let fixture: ComponentFixture<DoerProfileNotificationSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoerProfileNotificationSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoerProfileNotificationSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
