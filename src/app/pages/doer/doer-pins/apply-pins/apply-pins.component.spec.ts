import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyPinsComponent } from './apply-pins.component';

describe('ApplyPinsComponent', () => {
  let component: ApplyPinsComponent;
  let fixture: ComponentFixture<ApplyPinsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplyPinsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplyPinsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
