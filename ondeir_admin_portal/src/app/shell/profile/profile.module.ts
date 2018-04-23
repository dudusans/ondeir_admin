import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { InputMaskModule } from "ng2-inputmask";
import { ModalModule } from 'ngx-bootstrap';

import { ProfileComponent } from "./profile.component";
import { ProfileRoutingModule } from "./profile-routing.module";
import { OwnerService } from './../../shared/services/owner.service';
import { SharedModule } from '../../../../../ondeir_admin_shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ProfileRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    InputMaskModule,
    ModalModule.forRoot()
  ],
  declarations: [ProfileComponent],
  providers: [
    OwnerService
  ]
})
export class ProfileModule {}
