import { Component } from '@angular/core';
import { FooterService } from 'src/app/services/footer.service';

@Component({
  selector: 'app-landing-footer',
  templateUrl: './landing-footer.component.html',
  styleUrls: ['./landing-footer.component.scss']
})
export class LandingFooterComponent {
  showFooter = true;

  constructor(private footerService: FooterService) {}

  ngOnInit(): void {
    this.footerService.showFooter$.subscribe((show) => {
      this.showFooter = show;
    });
  }

}
