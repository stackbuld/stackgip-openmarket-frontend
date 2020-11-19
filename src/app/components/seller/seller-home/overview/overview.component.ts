import { Component, OnInit, Input } from '@angular/core';
// import { getLoggedInUser } from 'src/app/helpers/userUtility';
 import { OverView, OverviewApiModel } from 'src/app/models/products.model';
// import { ProductsService } from "../../../../services/products/products.service";

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
  @Input() overview: OverView;
  // overviews: OverView[];
  //  user = getLoggedInUser();

  constructor() { }

  ngOnInit(): void {

    // const users = this.user;
    // this.productService.getProductOverview(users.id).subscribe((view) => {
    //   this.overviews = view.data
    // })

  }

}
