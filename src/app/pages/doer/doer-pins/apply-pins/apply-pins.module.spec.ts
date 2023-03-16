import { ApplyPinsModule } from './apply-pins.module';

describe('ApplyPinsModule', () => {
  let applyPinsModule: ApplyPinsModule;

  beforeEach(() => {
    applyPinsModule = new ApplyPinsModule();
  });

  it('should create an instance', () => {
    expect(applyPinsModule).toBeTruthy();
  });
});
