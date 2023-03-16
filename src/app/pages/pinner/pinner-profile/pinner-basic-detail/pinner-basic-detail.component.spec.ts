import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PinnerBasicDetailComponent } from './pinner-basic-detail.component';

describe('PinnerBasicDetailComponent', () => {
  let component: PinnerBasicDetailComponent;
  let fixture: ComponentFixture<PinnerBasicDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PinnerBasicDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PinnerBasicDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
