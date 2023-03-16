import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitQuotationFormComponent } from './submit-quotation-form.component';

describe('SubmitQuotationFormComponent', () => {
  let component: SubmitQuotationFormComponent;
  let fixture: ComponentFixture<SubmitQuotationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmitQuotationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitQuotationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
