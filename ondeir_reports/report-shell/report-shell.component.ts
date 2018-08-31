import { ReportsService } from './../shared/services/reports.service';
import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../ondeir_admin_shared/base/base.component';
import { AlertService } from '../../ondeir_admin_shared/modules/alert/alert.service';
import { SystemEntity } from '../../ondeir_admin_shared/models/admin/system.model';
import { AuthService } from '../../ondeir_admin_portal/src/app/shared/services/auth.service';
import { SystemReportsEntity } from '../../ondeir_admin_shared/models/admin/systemReports.model';

@Component({
  selector: 'app-report-shell',
  templateUrl: './report-shell.component.html',
  styleUrls: ['./report-shell.component.scss']
})
export class ReportShellComponent extends BaseComponent implements OnInit {

  public reports: Array<SystemReportsEntity> = new Array<SystemReportsEntity>();

  constructor(alert: AlertService, private service: ReportsService, private authService: AuthService) {
    super(alert);
   }

  ngOnInit() {
    this.isProcessing = true;

    let ownerId: number = -1;

    if (this.getLoginInfo().type < 2) {
      ownerId = this.getLoginInfo().userId;
    }

    this.authService.GetOwnerReports(ownerId).subscribe(
      ret => {
        this.reports = ret.sort((obj1, obj2) => {
          return obj1.systemId - obj2.systemId;
        });

        this.isProcessing = false;
      }, 
      err => {
        this.reports = new Array<SystemReportsEntity>();
        this.isProcessing = false;
      }
    );

      
  }

  getReports(systemId: number) {
    
  }

}
