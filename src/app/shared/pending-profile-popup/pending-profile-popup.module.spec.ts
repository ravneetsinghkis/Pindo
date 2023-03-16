import { PendingProfilePopupModule } from './pending-profile-popup.module';

describe('PendingProfilePopupModule', () => {
  let pendingProfilePopupModule: PendingProfilePopupModule;

  beforeEach(() => {
    pendingProfilePopupModule = new PendingProfilePopupModule();
  });

  it('should create an instance', () => {
    expect(pendingProfilePopupModule).toBeTruthy();
  });
});
