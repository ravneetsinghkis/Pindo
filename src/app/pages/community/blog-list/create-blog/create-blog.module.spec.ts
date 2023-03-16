import { CreateBlogModule } from './create-blog.module';

describe('CreateBlogModule', () => {
  let createBlogModule: CreateBlogModule;

  beforeEach(() => {
    createBlogModule = new CreateBlogModule();
  });

  it('should create an instance', () => {
    expect(createBlogModule).toBeTruthy();
  });
});
