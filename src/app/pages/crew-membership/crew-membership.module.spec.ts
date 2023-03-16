import { CrewMembershipModule } from './crew-membership.module';

describe('CrewMembershipModule', () => {
  let crewMembershipModule: CrewMembershipModule;

  beforeEach(() => {
    crewMembershipModule = new CrewMembershipModule();
  });

  it('should create an instance', () => {
    expect(crewMembershipModule).toBeTruthy();
  });
});
