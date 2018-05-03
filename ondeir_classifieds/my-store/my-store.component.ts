import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { StoreEntity, EStoreType } from '../../ondeir_admin_shared/models/classifieds/store.model';
import { BaseComponent } from '../../ondeir_admin_shared/base/base.component';
import { AlertService } from '../../ondeir_admin_shared/modules/alert/alert.service';
import { ClassifiedsService } from '../shared/services/classifieds.service';

@Component({
  selector: 'app-my-store',
  templateUrl: './my-store.component.html',
  styleUrls: ['./my-store.component.scss']
})
export class MyStoreComponent extends BaseComponent implements OnInit {
  selectedType = 0;

  store: StoreEntity;

  constructor(alert: AlertService, private route: ActivatedRoute, private service: ClassifiedsService) {
    super(alert);
   }

  ngOnInit() {
    // iniciando entidade de dados
    this.store = StoreEntity.GetInstance();

    //Iniciando Serviços
    this.service.Init();

    this.route.params.subscribe( params => {
      if (params["id"]) {
        this.isProcessing = true; 

        this.service.StoreService.GetItem([params["id"]]).subscribe(
          ret => {
            this.isProcessing = false;
            this.store = ret;
          },
          err => {
            this.isProcessing = false;
            this.alert.alertError("Detalhe Loja", err);
          }
        );
      }
    });
  }

  /** FrontEnd Methods */
  onSave() {
    this.isProcessing = true;

    this.service.StoreService.UpdateItem(this.store).subscribe(
      ret => {
        this.isProcessing = false;

        this.alert.alertInformation("Atualizar Loja", "Dados da loja atualizados com sucesso");
      },
      err => {
        this.isProcessing = false;
        this.alert.alertError("Detalhe Loja", err);
      }
    );
  }

  onStoreView() {

  }

  onStoreStatusChange(event) {
    if (this.store.type === EStoreType.Undefined) {
      this.alert.alertWarning("Ativar Loja", "Não é possível ativar um loja sem tipo definido");
      this.store.active = false;      
    }
  }

  setSelectedType(type) {
    this.store.type = <EStoreType>type;
  }

  onLogoSelect(files) {
    if (files && files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        this.store.logo = reader.result;
      };

      reader.readAsDataURL(files[0]);

    }
  }

  onHeaderSelect(files) {
    if (files && files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        this.store.header = reader.result;
      };

      reader.readAsDataURL(files[0]);

    }
  }
}
