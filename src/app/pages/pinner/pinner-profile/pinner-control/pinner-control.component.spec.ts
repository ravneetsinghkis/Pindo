import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PinnerControlComponent } from './pinner-control.component';

describe('PinnerControlComponent', () => {
  let component: PinnerControlComponent;
  let fixture: ComponentFixture<PinnerControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PinnerControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PinnerControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
