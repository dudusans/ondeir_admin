import { Component, OnInit } from '@angular/core';

import { BaseComponent } from '../../ondeir_admin_shared/base/base.component';
import { AlertService } from '../../ondeir_admin_shared/modules/alert/alert.service';
import { ReportsService } from '../shared/services/reports.service';

@Component({
  selector: 'app-loyalty-programs',
  templateUrl: './loyalty-programs.component.html',
  styleUrls: ['./loyalty-programs.component.scss']
})
export class LoyaltyProgramsComponent extends BaseComponent implements OnInit {

  programs: Array<any> = new Array<any>();

  constructor(alert: AlertService, private service: ReportsService) {
    super(alert);
  }

  ngOnInit() {
    this.isProcessing = true;

    this.service.ListLoyaltyPrograms(this.loginInfo.userId).subscribe(
      ret => {
          this.isProcessing = false;

          this.programs = ret;
      },
      err => {
          this.alert.alertError("Listar Cupons de Ofertas", err);
          this.isProcessing = false;
      }
    );
  }

}
