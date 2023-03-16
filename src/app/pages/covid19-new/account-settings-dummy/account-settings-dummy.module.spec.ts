import { AccountSettingsDummyModule } from './account-settings-dummy.module';

describe('AccountSettingsDummyModule', () => {
  let accountSettingsDummyModule: AccountSettingsDummyModule;

  beforeEach(() => {
    accountSettingsDummyModule = new AccountSettingsDummyModule();
  });

  it('should create an instance', () => {
    expect(accountSettingsDummyModule).toBeTruthy();
  });
});
