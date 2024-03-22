import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-variant',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-variant.component.html',
  styleUrls: ['./delete-variant.component.scss'],
})
export class DeleteVariantComponent {
  constructor(private dialog: MatDialog) {}

  onDelete() {
    // this.dialog
  }

  onCancel() {
    this.dialog.closeAll();
  }
}
