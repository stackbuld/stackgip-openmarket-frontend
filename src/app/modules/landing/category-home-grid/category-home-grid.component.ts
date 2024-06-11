import { ICategory } from '../../../models/CategoryModels';
import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/services/category/category.service';

@Component({
  selector: 'app-category-home-grid',
  templateUrl: './category-home-grid.component.html',
  styleUrls: ['./category-home-grid.component.css'],
})
export class CategoryHomeGridComponent implements OnInit {
  categories: ICategory[] = [];
  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.categoryService.GetCategory().subscribe((a) => {
      this.categories = a.data;
    });
  }
}
