import { Utils } from './../../../ondeir_admin_shared/utils/Utils';
import { EModelType, EGearType, EGasType } from './../../../ondeir_admin_shared/models/classifieds/motors.model';
import { ClassifiedsService } from './../../shared/services/classifieds.service';
import { Component, OnInit, Input } from '@angular/core';
import { MotorAssemblerEntity } from '../../../ondeir_admin_shared/models/classifieds/motorsAssembler.model';

@Component({
  selector: 'app-product-auto',
  templateUrl: './product-auto.component.html',
  styleUrls: ['./product-auto.component.scss']
})
export class ProductAutoComponent implements OnInit {
  @Input() classified;

  assemblers: Array<MotorAssemblerEntity> = new Array<MotorAssemblerEntity>();
  models = Utils.enumToArray(EModelType);
  gears = Utils.enumToArray(EGearType);
  fuels = Utils.enumToArray(EGasType);

  constructor(private services: ClassifiedsService) { 
    this.classified = MotorAssemblerEntity.GetInstance();
  }

  ngOnInit() {
    this.services.ListAssemblers().subscribe(
      ret => {
        this.assemblers = ret;
      }
    );

    console.log(Utils.enumToArray(EModelType));
  }

  //Front End Methods
  onAssemblerChange() {
    this.classified.assembler = this.assemblers.find(x=> x.id == this.classified.assemblerId);
  }
}
