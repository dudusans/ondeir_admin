import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModalModule } from 'ngx-bootstrap';
import { LoadingComponent } from './modules/loading/loading.component';
import { AlertComponent } from './modules/alert/alert.component';
import { PageHeaderComponent } from './modules/page-header/page-header.component';
import { FieldControlErrorComponent } from './modules/field-control-error/field-control-error.component';
import { DialogComponent } from './modules/dialog/dialog.component';
import { DynamicViewComponent } from './modules/dynamic-view/dynamic-view.component';
import { StatComponent } from './modules/stat/stat.component';

import { DefaultImageDirective } from './directives/defautImage.directive';
import { FocusDirective } from './directives/focus.directive';
import { ToggleSelectDirective } from './directives/toggleSelect.directive';
import { DisableControlDirective } from './directives/disableControl.directive';


@NgModule({
  imports: [
    CommonModule,
    ModalModule.forRoot()
  ],
  declarations: [
    LoadingComponent,
    DefaultImageDirective,
    AlertComponent,
    PageHeaderComponent,
    FieldControlErrorComponent,
    DialogComponent,
    DynamicViewComponent,
    FocusDirective,
    ToggleSelectDirective,
    StatComponent,
    DisableControlDirective
  ],
  exports: [
    LoadingComponent,
    DefaultImageDirective,
    AlertComponent,
    PageHeaderComponent,
    FieldControlErrorComponent,
    DialogComponent,
    FocusDirective,
    ToggleSelectDirective,
    StatComponent,
    DynamicViewComponent,
    DisableControlDirective
  ],
  providers: [
  ]
})
export class SharedModule {}
