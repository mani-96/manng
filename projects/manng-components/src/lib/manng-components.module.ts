import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'
import { ManngComponentsComponent } from './manng-components.component';
import { TableComponent } from './table/table.component';
import { TypeaheadComponent } from './typeahead/typeahead.component';
import { MultiselectComponent } from './multiselect/multiselect.component';
import { AppCustomCellComponent } from './table/app-custom-cell/app-custom-cell.component';
import { RenderedCellComponent } from './table/rendered-cell/rendered-cell.component';
import { MultiselectItemComponent } from './multiselect/multiselect-item/multiselect-item.component';



@NgModule({
  declarations: [ManngComponentsComponent, TableComponent, TypeaheadComponent, MultiselectComponent, AppCustomCellComponent, RenderedCellComponent, MultiselectItemComponent],
  imports: [ CommonModule
  ],
  exports: [ManngComponentsComponent, TableComponent, MultiselectComponent, TypeaheadComponent]
})
export class ManngComponentsModule { }
