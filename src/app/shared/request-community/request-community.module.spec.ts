import { RequestCommunityModule } from './request-community.module';

describe('RequestCommunityModule', () => {
  let requestCommunityModule: RequestCommunityModule;

  beforeEach(() => {
    requestCommunityModule = new RequestCommunityModule();
  });

  it('should create an instance', () => {
    expect(requestCommunityModule).toBeTruthy();
  });
});
