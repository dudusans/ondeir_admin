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

  constructor(private services: ClassifiedsService) { 
    this.classified = MotorAssemblerEntity.GetInstance();
  }

  ngOnInit() {
    this.services.ListAssemblers().subscribe(
      ret => {
        this.assemblers = ret;
      }
    );
  }

  //Front End Methods
  onAssemblerChange() {
    this.classified.assembler = this.assemblers.find(x=> x.id == this.classified.assemblerId);
  }
}
