import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { DateRange } from './date-range.dto';

@Component({
  selector: 'date-range-picker',
  templateUrl: 'date-range.html',
})
export class DateRangePicker {
  @Output() onApplyDateRange = new EventEmitter<DateRange>();
  @Input() className: string = '';

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  constructor(private toast: ToastrService) {}

  get dateRange(): DateRange {
    const dateRange: DateRange = {
      start: this.range.value.start?.toISOString()!,
      end: this.range.value.end?.toISOString()!,
    };
    return dateRange;
  }

  applyCustomDateRange(): void {
    if (!this.dateRange.start || this.dateRange.start == undefined) {
      this.toast.error('Start and end date is required.');
      return;
    } else if (!this.dateRange.end || this.dateRange.end == undefined) {
      this.toast.error('Start and end date is required.');
      return;
    }
    this.onApplyDateRange.emit(this.dateRange);
  }
}
