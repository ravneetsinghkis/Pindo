import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareprofileComponent } from './shareprofile.component';

describe('ShareprofileComponent', () => {
  let component: ShareprofileComponent;
  let fixture: ComponentFixture<ShareprofileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareprofileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
