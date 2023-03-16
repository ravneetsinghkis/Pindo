import { Covid19NewModule } from './covid19-new.module';

describe('Covid19NewModule', () => {
  let covid19NewModule: Covid19NewModule;

  beforeEach(() => {
    covid19NewModule = new Covid19NewModule();
  });

  it('should create an instance', () => {
    expect(covid19NewModule).toBeTruthy();
  });
});
