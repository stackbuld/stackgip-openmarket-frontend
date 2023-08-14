import { Component } from '@angular/core';
import uikit from 'uikit';
@Component({
  selector: 'app-login-pop-up-modal',
  templateUrl: './login-pop-up-modal.component.html',
  styleUrls: ['./login-pop-up-modal.component.scss']
})
export class LoginPopUpModalComponent {


  closeModal() {
    uikit.modal("#confirm-seller-signup").hide()
    uikit.modal('#confirm-seller-register').hide()
  }
}
