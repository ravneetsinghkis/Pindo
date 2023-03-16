import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoerSupportComponent } from './doer-support.component';

describe('DoerSupportComponent', () => {
  let component: DoerSupportComponent;
  let fixture: ComponentFixture<DoerSupportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoerSupportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoerSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
