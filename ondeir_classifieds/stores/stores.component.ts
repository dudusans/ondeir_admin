import { Component, OnInit } from '@angular/core';

import { BaseComponent } from '../../ondeir_admin_shared/base/base.component';
import { ClassifiedsService } from '../shared/services/classifieds.service';
import { AlertService } from './../../ondeir_admin_shared/modules/alert/alert.service';
import { StoreEntity } from '../../ondeir_admin_shared/models/classifieds/store.model';

@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrls: ['./stores.component.scss']
})
export class StoresComponent extends BaseComponent implements OnInit {
  stores: Array<any> = new Array<any>();

  constructor(alert: AlertService, private service: ClassifiedsService) { 
    super(alert);
  }

  ngOnInit() {
    this.isProcessing = true;

    this.service.ListStores().subscribe(
      ret => {
        this.isProcessing = false;

        this.stores = ret;
      },
      err => {
        this.isProcessing = false;
        this.alert.alertError("Lojas de Classificados", err);
      }
    );
  }

}
