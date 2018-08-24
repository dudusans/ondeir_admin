import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../ondeir_admin_shared/base/base.component';
import { AlertService } from '../../../ondeir_admin_shared/modules/alert/alert.service';
import { ActivatedRoute } from '@angular/router';
import { ClassifiedsService } from '../../shared/services/classifieds.service';
import { MotorAssemblerEntity } from '../../../ondeir_admin_shared/models/classifieds/motorsAssembler.model';

@Component({
  selector: 'app-list-brands',
  templateUrl: './list-brands.component.html',
  styleUrls: ['./list-brands.component.scss']
})
export class ListBrandsComponent extends BaseComponent  implements OnInit {
  public headerTitle: string = "";
  public cityId: number = 0;
  public cityName: string = "";
  public assemblers: Array<MotorAssemblerEntity> = new Array<MotorAssemblerEntity>();

  constructor(alert: AlertService, private route: ActivatedRoute, private service: ClassifiedsService) { 
    super(alert);
  }

  ngOnInit() {
    this.isProcessing = true;

    this.service.ListAssemblers().subscribe(
      ret => {
        this.isProcessing = false;

        this.assemblers = ret;
      }, 
      err => {
        this.alert.alertError("Listagem de Montadoras", err);
        this.isProcessing = false;
      }
     );


    this.route.params.subscribe( params => {

      if (params["id"]) {
        this.cityId = params["id"];
        this.isProcessing = true;
        this.cityName = params["cityName"];
        this.headerTitle = "Automóveis " + this.cityName;
      }
    });
  }

}
