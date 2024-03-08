import { Component, Input, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoGuideComponent } from '../../../modules/landing/video-guide/video-guide.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { SharedModule } from '../../shared.module';

@Component({
  selector: 'app-video-guide-prompt',
  standalone: true,
  imports: [CommonModule, MatDialogModule, SharedModule],
  templateUrl: './video-guide-prompt.component.html',
  styleUrls: ['./video-guide-prompt.component.scss'],
})
export class VideoGuidePromptComponent {
  @Input() promptHeading!: string;
  @Input() contents: {
    videoId: string;
    text: string;
    heading: string;
    action: string;
    routeUrl: string;
  }[] = [];
  @Input() dialogHeading!: string;
  constructor(private dialog: MatDialog) {}
  onOpenVideoDialog(
    videoId: string,
    heading: string,
    action: string,
    routeUrl: string,
  ) {
    console.log(videoId);
    this.dialog.open(VideoGuideComponent, {
      panelClass: 'otp_dialog',
      data: { videoId, heading, action, routeUrl },
    });
  }
}
