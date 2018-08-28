import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../ondeir_admin_shared/base/base.component';
import { AlertService } from '../../../ondeir_admin_shared/modules/alert/alert.service';
import { ActivatedRoute } from '@angular/router';
import { ClassifiedsService } from '../../shared/services/classifieds.service';
import { ClassifiedEntity } from '../../../ondeir_admin_shared/models/classifieds/classified.model';

@Component({
  selector: 'app-list-cars',
  templateUrl: './list-cars.component.html',
  styleUrls: ['./list-cars.component.scss']
})
export class ListCarsComponent extends BaseComponent implements OnInit {
  public headerTitle: string = "";
  public cityId: number = 0;
  public userId: number = 0;
  public cityName: string = "";
  public assembler: number = 0;
  public cars: Array<ClassifiedEntity> = new Array<ClassifiedEntity>();

  constructor(alert: AlertService, private route: ActivatedRoute, private service: ClassifiedsService) { 
    super(alert);
  }

  ngOnInit() {
    this.isProcessing = true;

    this.route.params.subscribe( params => {

      if (params["id"]) {
        this.cityId = params["id"];
        this.userId = params["userId"];
        this.isProcessing = true;
        this.cityName = params["cityName"];
        this.assembler = params["assembler"];
        this.headerTitle = "Automóveis " + this.cityName;

        this.service.ListCars(this.cityId, this.assembler).subscribe(
          ret => {
            this.isProcessing = false;
    
            this.cars = ret;
          }, 
          err => {
            this.alert.alertError("Listagem de Automóveis", err);
            this.isProcessing = false;
          }
         );
      }
    });
  }  
}

