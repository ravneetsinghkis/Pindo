import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteBlockerDialogComponent } from './quote-blocker-dialog.component';

describe('QuoteBlockerDialogComponent', () => {
  let component: QuoteBlockerDialogComponent;
  let fixture: ComponentFixture<QuoteBlockerDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuoteBlockerDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteBlockerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
