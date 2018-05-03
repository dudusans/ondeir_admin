import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../ondeir_admin_shared/base/base.component';
import { AlertService } from '../../ondeir_admin_shared/modules/alert/alert.service';
import { ClassifiedsService } from '../shared/services/classifieds.service';
import { StoreEntity } from '../../ondeir_admin_shared/models/classifieds/store.model';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent extends BaseComponent implements OnInit {
  classifieds: Array<any> = new Array<any>();
  store: StoreEntity = StoreEntity.GetInstance();

  constructor(alert: AlertService, private service: ClassifiedsService) { 
    super(alert);
  }

  ngOnInit() {
    this.isProcessing = true;

    this.service.Init();

    this.store = null;

    this.service.StoreService.GetItem([this.loginInfo.userId.toString()]).subscribe(
      ret => {
        this.store = ret;
      }
    );

    let ownerid = -1;

    if (this.loginInfo.type !== 3) {
      ownerid = this.loginInfo.userId;
    }

    this.service.ListOwnerProducts(ownerid).subscribe(
      ret => {
        this.isProcessing = false;

        this.classifieds = ret;
      },
      err => {
        this.isProcessing = false;
        this.alert.alertError("Lojas de Classificados", err);
      }
    );
  }

}
