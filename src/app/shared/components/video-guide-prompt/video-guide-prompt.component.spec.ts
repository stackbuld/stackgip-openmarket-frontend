import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoGuidePromptComponent } from './video-guide-prompt.component';

describe('VideoGuidePromptComponent', () => {
  let component: VideoGuidePromptComponent;
  let fixture: ComponentFixture<VideoGuidePromptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ VideoGuidePromptComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoGuidePromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
