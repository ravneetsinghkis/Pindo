import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostsocialdialogComponent } from './postsocialdialog.component';

describe('PostsocialdialogComponent', () => {
  let component: PostsocialdialogComponent;
  let fixture: ComponentFixture<PostsocialdialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostsocialdialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostsocialdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
