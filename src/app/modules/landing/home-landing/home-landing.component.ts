import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { WindowRefService } from 'src/app/shared/services/window.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HomeService } from 'src/app/services/home/home.service';
import { ToastrService } from 'src/app/services/toastr.service';

@Component({
  selector: 'app-home-landing',
  templateUrl: './home-landing.component.html',
  styleUrls: ['./home-landing.component.scss'],
})
export class HomeLandingComponent implements AfterViewInit, OnInit {
  window: Window;
  contactForm: FormGroup;
  subjectSelect: FormControl = new FormControl(null);
  isSending: boolean = false;
  constructor(
    private activeRoute: ActivatedRoute,
    private meta: Meta,
    private title: Title,
    private windowRefS: WindowRefService,
    private homeService: HomeService,
    private toastr: ToastrService
  ) {
    this.meta.addTags([
      {
        name: 'description',
        content:
          'Renamarket best online platform to buy and sell securely with fast same day delivery',
      },
      {
        name: 'keywords',
        content:
          'Rena market, Buy online, Sell online, Grow faster, Buy with crypto, E-commerce accepting Crypto, Fast delivery',
      },
    ]);
    this.setTitle(
      'Renamarket - Fastest and most secured platform to buy and sell'
    );
    this.window = windowRefS.nativeWindow;
  }
  public setTitle(newTitle: string) {
    this.title.setTitle(newTitle);
  }
  @ViewChild('container') container: ElementRef<HTMLElement>;

  ngOnInit() {
    //   this.windowRefS.nativeWindow.document.body.scrollTop = 0;
    // this.window.document.documentElement.scrollTop = 0;

    this.contactForm = new FormGroup({
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      phoneNumber: new FormControl(null, Validators.required),
      subject: new FormControl(null, Validators.required),
      message: new FormControl(null, Validators.required),
    });

    this.subjectSelect.valueChanges.subscribe((value) => {
      if (value) {
        this.contactForm.patchValue({
          subject: value,
        });
      }
    });
  }

  ngAfterViewInit(): void {
    this.activeRoute.params.subscribe((param) => {
      // alert(param.pageSec)
      if (param.pageSec) {
        const section = this.container.nativeElement.querySelector(
          `#${param.pageSec}`
        );

        section?.scrollIntoView();
      }
    });
  }

  onSubmit() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSending = true;
    this.homeService.sendContactUsRequest(this.contactForm.value).subscribe({
      next: (res) => {
        this.toastr.success('Message sent successfully!');
        this.contactForm.reset();
        this.isSending = false;
      },
      error: (err) => {
        this.isSending = false;
        this.toastr.success('Something went wrong!');
      },
    });
  }
}
