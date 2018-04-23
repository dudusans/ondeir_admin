import { OwnerService } from './../../shared/services/owner.service';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Md5 } from 'ts-md5';

import { Validators, FormBuilder } from '@angular/forms';
import { OwnerEntity } from '../../shared/models/owner/ownerEntity';
import { AlertService } from '../../../../../ondeir_admin_shared/modules/alert/alert.service';
import { DialogService } from '../../../../../ondeir_admin_shared/modules/dialog/dialog.service';
import { BaseComponent } from '../../../../../ondeir_admin_shared/base/base.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent extends BaseComponent implements OnInit {
  owner: OwnerEntity;
  password: string;
  confirmpassword: string;

  modalRef: BsModalRef;

  constructor(alert: AlertService, private service: OwnerService, private formBuilder: FormBuilder, private dialogService: DialogService,
    private modalService: BsModalService) {
    super(alert);
  }

  ngOnInit() {
    this.isProcessing = true;

    this.initForm();

    // iniciando entidade de dados
    this.owner = OwnerEntity.getInstance();

    this.service.GetOwner(this.loginInfo.userId).subscribe(
      ret => {
        this.isProcessing = false;

        this.owner = ret;
      },
      err => {
        this.alert.alertError("Meus Dados", err);
        this.isProcessing = false;
      }
    );
  }

  initForm() {
    this.formFields = this.formBuilder.group({
      id: [{value: 0, disabled: true}],
      name: ["", Validators.required],
      email: ["", Validators.required],
      cellphone: ["", Validators.required],
      title: [{value: "", disabled: true}]
   });
  }

  onFileSelect(files) {
    if (files && files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        this.owner.logo = reader.result;
      };

      reader.readAsDataURL(files[0]);

    }
  }

  openUpdatePasswordModel(template: TemplateRef<any>) {
    this.password = "";
    this.confirmpassword = "";

    this.modalRef = this.modalService.show(template);
  }

  onSave() {
    if (this.validOnSubmit) {
      this.isProcessing = true;

      this.service.UpdateOwner(this.owner).subscribe(
        ret => {
          this.isProcessing = false;
          this.alert.alertInformation("Atualizar Meus Dados", "Dados atualizados com sucesso");
        },
        err => {
          this.isProcessing = false;
          this.alert.alertError("Atualizar dados", err);
        }
      );
    }
  }

  updatePassword() {
    this.alert.closeAlert();

    if (this.password !== "" && this.confirmpassword !== "") {
        if (this.password === this.confirmpassword) {
            if (this.password.length <= 6) {
                this.alert.alertWarning("Atualizar Senha", "A senha deve ter mais que 6 caracteres");
                return;
            }

            const passRegex = new RegExp("^(?=.*[a-z])(?=.*[0-9])");
            if (!passRegex.test(this.password)) {
                this.alert.alertWarning("Atualizar Senha", "A senha deve conter letras e números");
                return;
            }

            this.isProcessing = true;
            this.service
                .UpdatePassword(this.owner.id, Md5.hashStr(this.password).toString())
                .subscribe(
                    ret => {
                        this.isProcessing = false;

                        this.alert.alertInformation(
                            "Atualizar Senha",
                            "Senha atualizada com sucesso"
                        );

                        this.password = "";
                        this.confirmpassword = "";
                        this.modalRef.hide();
                    },
                    err => {
                        this.alert.alertError("Atualizar Senha", err);

                        this.isProcessing = false;
                    }
                );
        } else {
            this.alert.alertWarning(
                "Alterar Senha",
                "Senhas digitadas não conferem"
            );
        }
    }
}
}
