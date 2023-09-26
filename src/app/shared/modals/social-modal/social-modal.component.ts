import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { WindowRefService } from '../../services/window.service';
import { CredentialResponse, PromptMomentNotification } from 'google-one-tap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';


declare const FB: any;


@Component({
  selector: 'app-social-modal',
  templateUrl: './social-modal.component.html',
  styleUrls: ['./social-modal.component.scss']
})
export class SocialModalComponent implements OnInit {
  private clientId = environment.googleClientId;
  window: Window;

constructor(
  windowRefService: WindowRefService,
  private ngxService: NgxUiLoaderService,
  public authService: AuthService,
  private toast: ToastrService,

){
  this.window = windowRefService.nativeWindow;

}
  
  ngOnInit(): void {
   // @ts-ignore
   this.window.onGoogleLibraryLoad = () => {
    // @ts-ignore
    google.accounts.id.initialize({
      client_id: this.clientId,
      callback: this.handleGoogleAuth.bind(this),
      auto_select: false,
      cancel_on_tap_outside: true,
    });
    // @ts-ignore
    google.accounts.id.renderButton(
      // @ts-ignore
      document.getElementById("buttonDiv"),
      { theme: "filled_black", size: "large", width: 200,text: "signup_with"} 
    );
    // @ts-ignore
    google.accounts.id.prompt((notification: PromptMomentNotification) => {});
  };
  }

  async handleGoogleAuth(response: CredentialResponse) {
    this.ngxService.startLoader('loader-01');
    await this.authService.LoginWithGoogle(response.credential).subscribe(
      (res) => {
        this.authService.handleAuthResponse(res,'signin', 'google');
      },
      (err) => {
        this.toast.error(err.error.message);
        this.ngxService.stopLoader('loader-01');
        this.ngxService.stopAll();
      }
    );
  }

  async facebookLogin() {
    FB.login(
      async (result: any) => {
        let token = result.authResponse.accessToken;
        let userId = result.authResponse.userID;
        this.ngxService.startLoader('loader-01');
        await this.authService.LoginWithFacebook(token, userId).subscribe(
          (res) => {
            this.authService.handleAuthResponse(res,'signin', 'facebook');
          },
          (err) => {
            this.toast.error(err.error.message);
            this.ngxService.stopLoader('loader-01');
            this.ngxService.stopAll();
          }
        );
      },
      { scope: 'email' }
    );
  }

  toggleLoginModal = () => {
    this.authService.showSharedLoginModal();
  }

}
