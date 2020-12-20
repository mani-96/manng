import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'
import { ManngComponentsComponent } from './manng-components.component';
import { TableComponent } from './table/table.component';
import { TypeaheadComponent } from './typeahead/typeahead.component';
import { MultiselectComponent } from './multiselect/multiselect.component';
import { AppCustomCellComponent } from './table/app-custom-cell/app-custom-cell.component';



@NgModule({
  declarations: [ManngComponentsComponent, TableComponent, TypeaheadComponent, MultiselectComponent, AppCustomCellComponent],
  imports: [ CommonModule
  ],
  exports: [ManngComponentsComponent, TableComponent, MultiselectComponent, TypeaheadComponent]
})
export class ManngComponentsModule { }
