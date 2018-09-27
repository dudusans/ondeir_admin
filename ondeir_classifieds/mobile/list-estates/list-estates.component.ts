import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../ondeir_admin_shared/base/base.component';
import { AlertService } from '../../../ondeir_admin_shared/modules/alert/alert.service';
import { ActivatedRoute } from '@angular/router';
import { ClassifiedsService } from '../../shared/services/classifieds.service';
import { ClassifiedEntity } from '../../../ondeir_admin_shared/models/classifieds/classified.model';
import { EEstateType } from '../../../ondeir_admin_shared/models/classifieds/estates.model';

@Component({
  selector: 'app-list-estates',
  templateUrl: './list-estates.component.html',
  styleUrls: ['./list-estates.component.scss']
})
export class ListEstatesComponent extends BaseComponent implements OnInit {
  public headerTitle: string = "";
  public cityId: number = 0;
  public userId: number = 0;
  public cityName: string = "";
  public type: number = 0;
  public estates: Array<ClassifiedEntity> = new Array<ClassifiedEntity>();

  constructor(alert: AlertService, private route: ActivatedRoute, private service: ClassifiedsService) { 
    super(alert);
  }

  ngOnInit() {
    this.isProcessing = true;

    this.route.params.subscribe( params => {

      if (params["id"]) {
        this.cityId = params["id"];
        this.userId = params["userId"];        
        this.cityName = params["cityName"];
        this.type = params["type"];
        this.headerTitle = "Imóveis " + this.cityName;

        this.isProcessing = true;

        this.service.ListEstates(this.cityId, this.type).subscribe(
          ret => {
            this.isProcessing = false;
    
            this.estates = ret;
          }, 
          err => {
            this.alert.alertError("Listagem de Imóveis", err);
            this.isProcessing = false;
          }
         );
      }
    });
  }
  
  getEstateType(type) {
    return EEstateType[type];
  }
}

