import { PinnerListDialogModule } from './pinner-list-dialog.module';

describe('PinnerListDialogModule', () => {
  let pinnerListDialogModule: PinnerListDialogModule;

  beforeEach(() => {
    pinnerListDialogModule = new PinnerListDialogModule();
  });

  it('should create an instance', () => {
    expect(pinnerListDialogModule).toBeTruthy();
  });
});
