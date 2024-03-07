import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoGuideComponent } from '../../../modules/landing/video-guide/video-guide.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-video-guide-prompt',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './video-guide-prompt.component.html',
  styleUrls: ['./video-guide-prompt.component.scss'],
})
export class VideoGuidePromptComponent {
  constructor(private dialog: MatDialog) {}
  onOpenVideoDialog() {
    this.dialog.open(VideoGuideComponent, {
      panelClass: 'otp_dialog',
    });
  }
}
