import { CreatePinDummyModule } from './create-pin-dummy.module';

describe('CreatePinDummyModule', () => {
  let createPinDummyModule: CreatePinDummyModule;

  beforeEach(() => {
    createPinDummyModule = new CreatePinDummyModule();
  });

  it('should create an instance', () => {
    expect(createPinDummyModule).toBeTruthy();
  });
});
