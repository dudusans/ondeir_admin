import { Component, OnInit } from '@angular/core';

import { AlertService } from '../../../../../ondeir_admin_shared/modules/alert/alert.service';
import { BaseComponent } from '../../../../../ondeir_admin_shared/base/base.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends BaseComponent implements OnInit {

  constructor(alert: AlertService) {
    super(alert);
  }

  ngOnInit() {
  }
}
