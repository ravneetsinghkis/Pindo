import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PinnerListDialogComponent } from './pinner-list-dialog.component';

describe('PinnerListDialogComponent', () => {
  let component: PinnerListDialogComponent;
  let fixture: ComponentFixture<PinnerListDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PinnerListDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PinnerListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
