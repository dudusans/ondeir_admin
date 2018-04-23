import { AdminService } from './../shared/services/admin.service';
import { Component, OnInit } from '@angular/core';

import { BaseComponent } from '../../ondeir_admin_shared/base/base.component';
import { AlertService } from '../../ondeir_admin_shared/modules/alert/alert.service';
import { SystemEntity } from '../../ondeir_admin_shared/models/admin/system.model';

@Component({
  selector: 'app-systems',
  templateUrl: './systems.component.html',
  styleUrls: ['./systems.component.scss']
})
export class SystemsComponent extends BaseComponent implements OnInit {
  systems: Array<SystemEntity> = new Array<SystemEntity>();

  constructor(alert: AlertService, private service: AdminService) { 
    super(alert);
  }

  ngOnInit() {
    this.isProcessing = true;

    this.service.Init();

    this.service.ScreenService.ListItems().subscribe(
      ret => {
        this.isProcessing = false;

        this.systems = ret.sort((obj1, obj2) => {
          return obj1.menuOrder - obj2.menuOrder;
        });
      }, 
      err => {
        this.isProcessing = false;
        this.alert.alertError("Listagem Aplicações", err);
      }
    );
  }

}
