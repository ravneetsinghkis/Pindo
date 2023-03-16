import { CheckpointModule } from './checkpoint.module';

describe('CheckpointModule', () => {
  let checkpointModule: CheckpointModule;

  beforeEach(() => {
    checkpointModule = new CheckpointModule();
  });

  it('should create an instance', () => {
    expect(checkpointModule).toBeTruthy();
  });
});
