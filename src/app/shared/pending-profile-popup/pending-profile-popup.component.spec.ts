import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingProfilePopupComponent } from './pending-profile-popup.component';

describe('PendingProfilePopupComponent', () => {
  let component: PendingProfilePopupComponent;
  let fixture: ComponentFixture<PendingProfilePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingProfilePopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingProfilePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
