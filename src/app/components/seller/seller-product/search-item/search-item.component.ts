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
  minValue: number = 10
  maxValue: number = 500000
  options:Options
  searchForm: FormGroup

  constructor(
    private fb: FormBuilder, private categoryService: CatgoryService,
    private toast: ToastrService
  ) {
    this.searchForm = this.fb.group({
      keyword: ["", []],
      category: ["", []],
      startDate: ["", []],
      endDate: ["", []],
    })
   }

  ngOnInit(): void {
    this.categories$ = this.categoryService.GetCategory()
    this.setPriceRangeOption()
  }

  setPriceRangeOption(){
    this.options = {
      floor: 10,
      ceil: 10000000,
      translate: (value: number, label: LabelType): string => {
        switch (label) {
          case LabelType.Low:
            return '<b>Min price:</b> NGN ' + value
          case LabelType.High:
            return '<b>Max price:</b> NGN ' + value
          default:
            return 'NGN ' + value
        }
      }
    } as Options
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

  onClear(){
    this.searchForm.get('keyword').setValue('')
    this.searchForm.get('category').setValue('')
    this.searchForm.get('startDate').setValue('')
    this.searchForm.get('endDate').setValue('')
    this.categoryItem.nativeElement.innerText = ''
    this.minValue = 50
    this.maxValue = 500000
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
      minValue:this.minValue,
      maxValue:this.maxValue
    })
  }
}
