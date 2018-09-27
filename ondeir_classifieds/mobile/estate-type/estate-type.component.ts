import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../ondeir_admin_shared/base/base.component';
import { AlertService } from '../../../ondeir_admin_shared/modules/alert/alert.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-estate-type',
  templateUrl: './estate-type.component.html',
  styleUrls: ['./estate-type.component.scss']
})
export class EstateTypeComponent extends BaseComponent  implements OnInit {
  public headerTitle: string = "";
  public cityId: number = 0;
  public cityName: string = "";
  public userId: number = 0;

  constructor(alert: AlertService, private route: ActivatedRoute) { 
    super(alert);
  }

  ngOnInit() {
    this.route.params.subscribe( params => {

      if (params["id"]) {
        this.cityId = params["id"];
        this.userId = params["userId"];
        this.cityName = params["cityName"];
        this.headerTitle = "Imóveis " + this.cityName;
      }
    });
  }

}
