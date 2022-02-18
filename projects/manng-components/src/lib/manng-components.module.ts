import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'
import { TableComponent } from './table/table.component';
import { TypeaheadComponent } from './typeahead/typeahead.component';
import { MultiselectComponent } from './multiselect/multiselect.component';
import { AppCustomCellComponent } from './table/app-custom-cell/app-custom-cell.component';
import { RenderedCellComponent } from './table/rendered-cell/rendered-cell.component';
import { MultiselectItemComponent } from './multiselect/multiselect-item/multiselect-item.component';
import { TabviewComponent } from './tabview/tabview.component';
import { TabpanelComponent } from './tabview/tabpanel/tabpanel.component';
import { TypingAnimationDirective } from './typing-animation/typing-animation.directive';
import { OtpComponent } from './otp/otp.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [TableComponent, TypeaheadComponent, MultiselectComponent, AppCustomCellComponent, RenderedCellComponent, MultiselectItemComponent, TabviewComponent, TabpanelComponent, TypingAnimationDirective, OtpComponent],
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [TableComponent, MultiselectComponent, TypeaheadComponent, TabviewComponent, TabpanelComponent, TypingAnimationDirective, OtpComponent]
})
export class ManngComponentsModule { }
