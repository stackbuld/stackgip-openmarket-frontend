import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatSliderModule } from "@angular/material/slider";
import { LoaderComponent } from "./components/loader/loader.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatLabel } from "@angular/material/form-field";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { HttpClientJsonpModule } from "@angular/common/http";
import { NgxUiLoaderModule } from "ngx-ui-loader";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { MatRippleModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import {MatNativeDateModule} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
// import { ServicesComponent } from './components/services/services.component';
@NgModule({
  declarations: [LoaderComponent, ],
  imports: [CommonModule],
  exports: [
    HttpClientJsonpModule,
    MatSliderModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatRippleModule,
    FormsModule,
    MatAutocompleteModule,
    NgxUiLoaderModule,
    MatSelectModule,
    MatDialogModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatCheckboxModule,
  ],
})
export class SharedModule {}
