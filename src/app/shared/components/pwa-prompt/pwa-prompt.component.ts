import { Component } from '@angular/core';
import { PwaService } from '../../../services/pwa.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-pwa-prompt',
  templateUrl: './pwa-prompt.component.html',
  styleUrls: ['./pwa-prompt.component.scss'],
})
export class PwaPromptComponent {
  constructor(
    private pwaService: PwaService,
    private dialog: MatDialog,
  ) {}

  onPromptInstall() {
    this.pwaService.showInstallPrompt();
    this.onCancel();
  }

  onCancel() {
    localStorage.setItem('isPwaPromptCancelled', JSON.stringify(true));
    this.dialog.closeAll();
  }
}
