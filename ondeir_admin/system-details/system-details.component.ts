import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { BaseComponent } from '../../ondeir_admin_shared/base/base.component';
import { AlertService } from '../../ondeir_admin_shared/modules/alert/alert.service';
import { AdminService } from './../shared/services/admin.service';
import { DialogService } from '../../ondeir_admin_shared/modules/dialog/dialog.service';
import { SystemEntity } from '../../ondeir_admin_shared/models/admin/system.model';

@Component({
  selector: 'app-system-details',
  templateUrl: './system-details.component.html',
  styleUrls: ['./system-details.component.scss']
})
export class SystemDetailsComponent extends BaseComponent  implements OnInit {
  public screenList: Array<SystemEntity> = new Array<SystemEntity>();
  public screen: SystemEntity = SystemEntity.GetInstance();

  isNew: boolean = false;
  headerTitle: string = "";

  constructor(alert: AlertService, private service: AdminService, private formBuilder: FormBuilder,
    private route: ActivatedRoute,  private dialogService: DialogService, private location: Location) {
    super(alert);
  }

  ngOnInit() {

    this.service.Init();

    this.initForm();

    this.route.params.subscribe( params => {
      if (params["id"]) {
        this.isProcessing = true;

        this.service.ScreenService.GetItem([params["id"]]).subscribe(
          ret => {
            this.isProcessing = false;
            this.screen = ret;
          },
          err => {
            this.isProcessing = false;
            this.alert.alertError("Editar Tela", err);
          }
        );

        this.isNew = false;
        this.headerTitle = "Editar Tela/Funcionalidade";
      } else {
        this.isNew = true;
        this.headerTitle = "Criar Nova Tela/Funcionalidade";
      }
    });
  }

  initForm() {
    this.formFields = this.formBuilder.group({
      name: ["", Validators.required],
      title: ["", Validators.required],
      path: ["", Validators.required],
      icon: ["", Validators.required],
      order: [9999]
    });
  }

  // Front-end methods
  onFileSelect(files) {
    if (files && files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        this.screen.logo = reader.result;
      };

      reader.readAsDataURL(files[0]);

    }
  }

  onDelete() {
    this.dialogService.dialogConfirm("Excluir Sistema", "Deseja realmente excluir esta funcionalidade?", "Excluir", "Cancelar", ret => {
      if (ret) {
        this.isProcessing = true;

        this.service.ScreenService.DeleteItem([this.screen.id.toString()]).subscribe(
          result => {
            this.location.back();
          },
          err => {
            this.alert.alertError("Excluir Sistema", err);
              this.isProcessing = false;
          }
        );
      }
    });
  }

  onSave() {
    if (this.formIsValid()) {
      this.isProcessing = true;

      window.scrollTo(0, 0);

      if (this.isNew) {
        this.service.ScreenService.CreateItem(this.screen).subscribe(
          ret => {
            this.isProcessing = false;
            this.isNew = false;

            this.location.back();
          },
          err => {
            this.isProcessing = false;
            this.alert.alertError("Nova Tela", err);
          }
        );
      } else {
        this.service.ScreenService.UpdateItem(this.screen).subscribe(
          ret => {
            this.isProcessing = false;

            this.alert.alertInformation("Tela/Funcionalidade", "Funcionalidade atualizada com sucesso");
          },
          err => {
            this.isProcessing = false;
            this.alert.alertError("Nova Tela", err);
          }
        );
      }
     }
    }
  }
