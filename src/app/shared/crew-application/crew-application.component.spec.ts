import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrewApplicationComponent } from './crew-application.component';

describe('CrewApplicationComponent', () => {
  let component: CrewApplicationComponent;
  let fixture: ComponentFixture<CrewApplicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrewApplicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrewApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
