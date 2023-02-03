import { CatgoryService } from './../../../../services/category/catgory.service'
import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter} from '@angular/core'
import { CategoryResponse } from './../../../../models/CategoryModels'
import { ToastrService } from "./../../../../services/toastr.service"
import { Options, LabelType } from '@angular-slider/ngx-slider'
import { FormBuilder, FormGroup } from '@angular/forms'
import { Observable } from 'rxjs'
import { MatDatepickerToggle } from '@angular/material/datepicker'

@Component({
  selector: 'app-search-item',
  templateUrl: './search-item.component.html',
  styleUrls: ['./search-item.component.css']
})
export class SearchItemComponent implements OnInit {
  @ViewChild('categoryItem') categoryItem: ElementRef<HTMLElement>
  @ViewChild('startDateToggle') startDateToggle: MatDatepickerToggle<any> 
  @ViewChild('endDateToggle') endDateToggle: MatDatepickerToggle<any>
  @Output() onSearch = new EventEmitter()
  @Output() onSearchClear = new EventEmitter()
  categories$: Observable<CategoryResponse>
  search:string = ""
  categoryId:string = ""
  options:Options
  searchForm: FormGroup

  constructor(
    private fb: FormBuilder, private categoryService: CatgoryService,
    private toast: ToastrService
  ) {
    this.initForm();
   }

  ngOnInit(): void {
    this.categories$ = this.categoryService.GetCategory()
  }

  initForm() {
    this.searchForm = this.fb.group({
      keyword: ["", []],
      category: ["", []],
      startDate: ["", []],
      endDate: ["", []],
      minPrice: [0, []],
      maxPrice: [500000000000, []],
    })
  }

  preventLetter(evt: any): boolean {
    var charCode = evt.which ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) return false;
    return true;
  }

  onChangeMinPrice(){
    this.resetPrice()
  }

  onChangeMaxPrice(){
    if(this.resetPrice()){
      this.toast.error("Maximum price must be greater than minimum price")
    }
  }

  startDateChange(date:string){
    this.resetDate()
  }

  endDateChange(date:string){
    if(this.resetDate()){
      this.toast.error("End date must be greater than start date")
    }
  }

  resetDate():boolean{
    const startD = this.searchForm.get('startDate').value
    const endD = this.searchForm.get('endDate').value
    if(startD > endD){
      this.searchForm.get('endDate').setValue(startD)
      return true
    }
    return false
  }

  resetPrice():boolean{
    const start:number = this.searchForm.get('minPrice').value
    const end:number = this.searchForm.get('maxPrice').value
    if(start > end){
      this.searchForm.get('maxPrice').setValue(start)
      return true
    }
    return false
  }

  onClear(){
    // this.searchForm.get('keyword').setValue('')
    // this.searchForm.get('category').setValue('')
    // this.searchForm.get('startDate').setValue('') 
    // this.searchForm.get('endDate').setValue('')
    // this.searchForm.get('minPrice').setValue(50) 
    // this.searchForm.get('maxPrice').setValue(500000)
    // this.categoryItem.nativeElement.innerText = ''
    this.initForm();
    this.onSearchClear.emit({})
  }

  pickStartDate(){
    const _ = this.startDateToggle._button._elementRef.nativeElement.click()
  }

  pickEndDate(){
    const _ = this.endDateToggle._button._elementRef.nativeElement.click()
  }
  
  onSearchSubmit(){
    this.onSearch.emit({
      keyword:this.searchForm.get('keyword').value,
      category:this.searchForm.get('category').value,
      startDate:this.searchForm.get('startDate').value,
      endDate:this.searchForm.get('endDate').value,
      minValue:this.searchForm.get('minPrice').value,
      maxValue:this.searchForm.get('maxPrice').value
    })
  }
}
