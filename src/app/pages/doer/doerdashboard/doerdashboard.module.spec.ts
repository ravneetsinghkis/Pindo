import { DoerdashboardModule } from './doerdashboard.module';

describe('DoerdashboardModule', () => {
  let doerdashboardModule: DoerdashboardModule;

  beforeEach(() => {
    doerdashboardModule = new DoerdashboardModule();
  });

  it('should create an instance', () => {
    expect(doerdashboardModule).toBeTruthy();
  });
});
