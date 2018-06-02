import { Component, OnInit, Input } from '@angular/core';
import { Utils } from '../../../ondeir_admin_shared/utils/Utils';
import { EEstateType, ESalesType } from '../../../ondeir_admin_shared/models/classifieds/estates.model';

@Component({
  selector: 'app-product-estates',
  templateUrl: './product-estates.component.html',
  styleUrls: ['./product-estates.component.scss']
})
export class ProductEstatesComponent implements OnInit {
  @Input() classified;

  types = Utils.enumToArray(EEstateType);
  salesTypes = Utils.enumToArray(ESalesType);

  constructor() { }

  ngOnInit() {
  }

}
