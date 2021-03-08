import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {  MatDialogModule } from '@angular/material/dialog';
import { AngularMaterialModule } from './angular-material.module';
import { EllipsisPipe } from '../core/pipes/ellipsis-pipe';
import { DateLocaleFilter } from '../core/pipes/DateLocaleFilter';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { UpperDatePipe } from '../core/pipes/upper-date.pipe';
import { SearchTextBoxComponent } from '../components/search-text-box/search-text-box.component';
import { capitalizePipe } from '../core/pipes/capitalize.pipe';
import { CardComponent } from "../components/card/card.component";
import { NavbarComponent } from "../components/navbar/navbar.component";
import { DatepickerComponent } from "../components/datepicker/datepicker.component";
import { FormComponent } from "../components/form/form.component";
import { SidebarComponent } from "../components/sidebar/sidebar.component";
import { BasicListComponent } from "../components/basic-list/basic-list.component";
import { ShowErrorsComponent } from "../components/show-errors/show-errors.component";
import { TextBoxComponent } from "../components/text-box/text-box.component";
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
//import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { DropDownMenuComponent } from "../components/drop-down-menu/drop-down-menu.component";
import { MultiSelectComponent } from "../components/multi-select/multi-select.component";
import { RouterModule } from '@angular/router';
import { DateHelper } from '../core/helpers/date.helper';

@NgModule({
  declarations: [
    EllipsisPipe,
    UpperDatePipe,
    DateLocaleFilter,
    capitalizePipe,
    SearchTextBoxComponent,
    CardComponent,
    DatepickerComponent,
    FormComponent,
    NavbarComponent,
    BasicListComponent,
    ShowErrorsComponent,
    TextBoxComponent,
    SidebarComponent,
    DropDownMenuComponent, 
    MultiSelectComponent
  ],
  imports: [
    AngularMaterialModule,
    CommonModule,
    FormsModule,
    RouterModule ,
   // BasicListComponent,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    TranslateModule,
    //MatSnackBarModule,
    MatDialogModule,
    MatIconModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,     
    NgbModule,
 
  ],
  entryComponents: [

  ],
  exports: [
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatDialogModule,
   // MatSnackBarModule,
    AngularMaterialModule,
    EllipsisPipe,
    capitalizePipe,
    UpperDatePipe,
    DateLocaleFilter,
    NgbModalModule,
    SearchTextBoxComponent,
    CardComponent,
    DatepickerComponent,
    FormComponent,
    NavbarComponent,
    BasicListComponent,
    ShowErrorsComponent,
    TextBoxComponent,
    NgbModule,
    SidebarComponent,
    DropDownMenuComponent,
    MultiSelectComponent
    
  ],
 

})
export class SharedModule { }
