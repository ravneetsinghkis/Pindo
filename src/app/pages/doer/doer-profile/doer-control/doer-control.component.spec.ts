import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoerControlComponent } from './doer-control.component';

describe('DoerControlComponent', () => {
  let component: DoerControlComponent;
  let fixture: ComponentFixture<DoerControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoerControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoerControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
