import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-variant',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-variant.component.html',
  styleUrls: ['./delete-variant.component.scss'],
})
export class DeleteVariantComponent {
  constructor(private dialogRef: MatDialogRef<DeleteVariantComponent>) {}

  onDelete() {
    this.dialogRef.close('deleted');
  }

  onCancel() {
    this.dialogRef.close(null);
  }
}
