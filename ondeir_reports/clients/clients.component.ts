import { Component, OnInit } from '@angular/core';

import { BaseComponent } from '../../ondeir_admin_shared/base/base.component';
import { ReportsService } from '../shared/services/reports.service';
import { AlertService } from '../../ondeir_admin_shared/modules/alert/alert.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent extends BaseComponent implements OnInit {

  clients: Array<any> = new Array<any>();

  constructor(alert: AlertService, private service: ReportsService) {
    super(alert);
  }

  ngOnInit() {
    this.isProcessing = true;

    this.service.ListClients(this.loginInfo.userId).subscribe(
      ret => {
          this.isProcessing = false;

          this.clients = ret;
      },
      err => {
          this.alert.alertError("Listar Clientes", err);
          this.isProcessing = false;
      }
    );
  }

}
