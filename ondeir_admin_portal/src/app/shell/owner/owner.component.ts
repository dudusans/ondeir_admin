import { Component, OnInit } from '@angular/core';

import { OwnerService } from './../../shared/services/owner.service';
import { OwnerEntity } from '../../shared/models/owner/ownerEntity';
import { AlertService } from '../../../../../ondeir_admin_shared/modules/alert/alert.service';
import { BaseComponent } from '../../../../../ondeir_admin_shared/base/base.component';
import { DialogService } from '../../../../../ondeir_admin_shared/modules/dialog/dialog.service';

@Component({
  selector: 'app-owner',
  templateUrl: './owner.component.html',
  styleUrls: ['./owner.component.scss']
})
export class OwnerComponent extends BaseComponent implements OnInit {
  owners: Array<OwnerEntity>;

  constructor(alert: AlertService, private service: OwnerService, private dialogService: DialogService) {
    super(alert);
   }

  ngOnInit() {
    this.ListOwners();
  }

  ListOwners() {
    this.isProcessing = true;

    this.service.ListOwner().subscribe(
      ret => {
          this.isProcessing = false;

          this.owners = ret;
      },
      err => {
          console.log(err);
          this.alert.alertError("Listar Credendiados", err);
          this.isProcessing = false;
      }
    );
  }

  // Front End Methods
  resetPassword(email) {
    this.dialogService.dialogConfirm("Reset Senha", "Deseja realmente resetar a senha do cliente?", "Sim", "Não", ret => {
      if (ret) {
        this.isProcessing = true;

        this.service.ResetPassword(email).subscribe(
          result => {
            this.isProcessing = false;
            this.alert.alertInformation("Reset Senha", "Nova senha enviada com sucesso");
          },
          err => {
            this.alert.alertError("Reset Senha", err);
              this.isProcessing = false;
          }
        );
      }
    });
  }
}
