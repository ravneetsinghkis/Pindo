import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenPindoComponent } from './open-pindo.component';

describe('OpenPindoComponent', () => {
  let component: OpenPindoComponent;
  let fixture: ComponentFixture<OpenPindoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenPindoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenPindoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
