import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-video-guide',
  templateUrl: './video-guide.component.html',
  styleUrls: ['./video-guide.component.scss'],
})
export class VideoGuideComponent implements OnInit {
  @ViewChild('container', { static: true })
  container: ElementRef<HTMLDivElement>;
  heading!: string;
  width!: number;
  videoId!: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { videoId: string; heading: string },
    private dialog: MatDialog,
  ) {}
  ngOnInit() {
    this.heading = this.data.heading;
    this.videoId = this.data.videoId;
    this.handleResize();
    try {
    } catch {}
    const tag = document.createElement('script');
    document.body.appendChild(tag);
    tag.src = 'https://www.youtube.com/iframe_api?host=https://localhost:4200';
  }

  @HostListener('window:resize', ['$event'])
  handleResize(event?: Event): void {
    const containerWidth = this.container.nativeElement.offsetWidth;
    this.width = containerWidth - 40;
  }

  onClose() {
    this.dialog.closeAll();
  }
}
