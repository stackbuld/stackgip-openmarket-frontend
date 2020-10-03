import { ICategory } from "./../../../models/CategoryModels";
import { Component, OnInit } from "@angular/core";
import { CatgoryService } from "src/app/services/category/catgory.service";

@Component({
  selector: "app-category-home-grid",
  templateUrl: "./category-home-grid.component.html",
  styleUrls: ["./category-home-grid.component.css"],
})
export class CategoryHomeGridComponent implements OnInit {
  categories: ICategory[] = [];
  constructor(private categoryService: CatgoryService) {}

  ngOnInit(): void {
    this.categoryService.GetCategory().subscribe((a) => {
      this.categories = a.data;
    });
  }
}
