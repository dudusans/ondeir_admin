import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BaseComponent } from '../../ondeir_admin_shared/base/base.component';
import { AlertService } from '../../ondeir_admin_shared/modules/alert/alert.service';
import { ClassifiedsService } from './../shared/services/classifieds.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent extends BaseComponent implements OnInit {
  public storeType: number = 0;

  constructor(alert: AlertService, private route: ActivatedRoute, private service: ClassifiedsService) {
    super(alert);
   }

  ngOnInit() {
    //Iniciando Serviços
    this.service.Init();

    this.route.params.subscribe( params => {
      if (params["type"]) {
       this.storeType = <number>params["type"];
      }
    });
  }

  // Photos Upload Methods
  onUploadFinished(upload) {
    // const photo: PhotoEntity = new PhotoEntity();
    // photo.FileName = upload.file.name;
    // photo.FileSize = upload.file.size;
    // photo.FileType = upload.file.type;
    // photo.FileData = upload.src;

    // this.member.Photos.push(photo);
  }

  onRemoved(upload) {
    // const items = this.member.Photos.filter(
    //   x => x.FileName !== upload.file.name
    // );

    // this.member.Photos = items;
  }

  verifyHasPhotos() {
    //return this.member.Photos.length > 0;
  }

  //Screen Methods
  onSave() {

  }
}
