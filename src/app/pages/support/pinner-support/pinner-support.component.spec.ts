import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PinnerSupportComponent } from './pinner-support.component';

describe('PinnerSupportComponent', () => {
  let component: PinnerSupportComponent;
  let fixture: ComponentFixture<PinnerSupportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PinnerSupportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PinnerSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
