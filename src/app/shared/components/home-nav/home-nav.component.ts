import { Component, OnInit } from '@angular/core';
import { CatgoryService } from 'src/app/services/category/catgory.service';

@Component({
  selector: 'app-home-nav',
  templateUrl: './home-nav.component.html',
  styleUrls: ['./home-nav.component.scss']
})
export class HomeNavComponent implements OnInit {
  isSearch = false;
  categories: any;

  constructor(
    private categoryService: CatgoryService,
  ) { }

  ngOnInit(): void {
    this.fetchCategories();
  }

  fetchCategories = () => {
    this.categoryService.GetCategory().subscribe((res) => {
      this.categories = res.data;
    });
  }

  toggleMobileSearchBar = () => {
    this.isSearch = !this.isSearch;
  }

}
