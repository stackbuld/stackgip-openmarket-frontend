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
import { DialogService } from '../../../shared/services/dialog.service';
import { SellerStoreCreateDialogComponent } from '../../seller/seller-store/seller-store-create-dialog/seller-store-create-dialog.component';
import { SellerStoreService } from '../../../shared/services/seller-store.service';

@Component({
  selector: 'app-video-guide',
  templateUrl: './video-guide.component.html',
  styleUrls: ['./video-guide.component.scss'],
})
export class VideoGuideComponent implements OnInit, AfterViewInit {
  @ViewChild('container', { static: true })
  container: ElementRef<HTMLDivElement>;
  heading!: string;
  width!: number;
  videoId!: string;
  action!: string;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private data: {
      videoId: string;
      heading: string;
      action: string;
      routeUrl: string;
    },
    private dialog: MatDialog,
    private router: Router,
    private dialogService: DialogService,
    private sellerStoreService: SellerStoreService,
  ) {}
  ngOnInit() {
    this.heading = this.data.heading;
    this.videoId = this.data.videoId;
    this.action = this.data.action;
    try {
    } catch {}
    const tag = document.createElement('script');
    document.body.appendChild(tag);
    tag.src = 'https://www.youtube.com/iframe_api?host=https://localhost:4200';
  }

  ngAfterViewInit() {
    this.handleResize();
  }

  @HostListener('window:resize', ['$event'])
  handleResize(event?: Event): void {
    const containerWidth = this.container.nativeElement.clientWidth;
    this.width = containerWidth - 40;
  }

  onAction() {
    this.dialog.closeAll();
    if (this.action == 'Create a store') {
      this.dialogService
        .openDialog(SellerStoreCreateDialogComponent, {
          data: { data: null, mode: 'create' },
        })
        .afterClosed()
        .subscribe((res) => {
          res ? this.sellerStoreService.isAddingStoreFromDemo.next(true) : null;
        });
      return;
    }
    this.router.navigate([this.data.routeUrl]);
    this.onClose();
  }

  onClose() {
    this.dialog.closeAll();
  }
}
