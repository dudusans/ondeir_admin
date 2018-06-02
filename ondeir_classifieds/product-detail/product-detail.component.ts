import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { BaseComponent } from '../../ondeir_admin_shared/base/base.component';
import { AlertService } from '../../ondeir_admin_shared/modules/alert/alert.service';
import { ClassifiedsService } from './../shared/services/classifieds.service';
import { ClassifiedPhotoEntity } from '../../ondeir_admin_shared/models/classifieds/classifiedPhotos.model';
import { DialogService } from '../../ondeir_admin_shared/modules/dialog/dialog.service';
import { MotorsEntity } from './../../ondeir_admin_shared/models/classifieds/motors.model';
import { EstatesEntity } from '../../ondeir_admin_shared/models/classifieds/estates.model';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent extends BaseComponent implements OnInit {
  public storeType: number = 0;
  public classified;
  public classifiedId: number = 0;
  public isNew: boolean = true;

  constructor(alert: AlertService, private route: ActivatedRoute, private service: ClassifiedsService, private dialogService: DialogService,
    private location: Location) {
    super(alert);
   }

  ngOnInit() {
    //Iniciando Serviços
    this.service.Init();

    this.route.params.subscribe( params => {
      if (params["type"]) {
       this.storeType = <number>params["type"];
       
       if (this.storeType == 1) {
         this.classified = MotorsEntity.GetInstance();
       }
       if (this.storeType == 2) {
        this.classified = EstatesEntity.GetInstance();
      }
      }

      if (params["id"]){
        this.isNew = false;
        this.classifiedId = params["id"];

        this.isProcessing = true;
        this.service.GetProduct(this.storeType, this.classifiedId).subscribe(
          ret => {
            this.isProcessing = false;
            this.classified = ret;
          },
          err => {
            this.isProcessing = false;
            this.alert.alertError("Detalhe Classificado", err);
          }
        );
      }
    });
  }

  // Photos Upload Methods
  onUploadFinished(upload) {
    const photo: ClassifiedPhotoEntity = new ClassifiedPhotoEntity();
    photo.fileName = upload.file.name;
    // photo.FileSize = upload.file.size;
    // photo.FileType = upload.file.type;
    photo.image = upload.src;

    this.classified.classified.photos.push(photo);
  }

  onRemoved(upload) {
    const items = this.classified.classified.photos.filter(
      x => x.fileName !== upload.file.name
    );

    this.classified.classified.photos = items;
  }

  verifyHasPhotos() {
    //return this.member.Photos.length > 0;
  }

  uploadPhotos(photos) {
    if (photos && photos.length > 0){
      this.service.UploadPhotos(photos).subscribe(
        ret => {
          this.isProcessing = false;
          //this.alert.alertInformation("Upload Imagens", "Imagens do classificado atualizadas com sucesso");
        },
        err => {
          this.isProcessing = false;
          this.alert.alertError("Upload Imagens", err);
        }
      );
    } else {
      this.isProcessing = false;
    }
  }

  createNewCar() {
    this.classified.classified.ownerId = this.loginInfo.userId;

    this.service.CreateCarAd(this.classified).subscribe(
      ret => {
        this.classifiedId = ret;

        this.classified.classified.photos.forEach(element => {
          element.classifiedId = ret;
        });

        this.uploadPhotos(this.classified.classified.photos);

        this.alert.alertInformation("Novo Veículo", "O Anúncio do novo veículo foi criado com sucesso");
      },
      err => {
        this.isProcessing = false;
        this.alert.alertError("Criar novo veículo", err);
      }
    );
  }

  updateCar() {
    this.classified.classified.ownerId = this.loginInfo.userId;

    this.service.UpdateCarAd(this.classified).subscribe(
      ret => {
        this.classifiedId = ret;

        this.classified.classified.photos.forEach(element => {
          element.classifiedId = ret;
        });

        this.uploadPhotos(this.classified.classified.photos);

        this.alert.alertInformation("Novo Veículo", "O Anúncio do novo veículo foi criado com sucesso");
      },
      err => {
        this.isProcessing = false;
        this.alert.alertError("Criar novo veículo", err);
      }
    );
  }

  //Screen Methods
  onSave() {
    this.isProcessing = true;
    window.scroll(0,0);

    if (this.storeType == 1 && this.isNew){
      return this.createNewCar();
    }

    if (this.storeType == 1 && !this.isNew){
      this.updateCar();
    }
  }

  onDelete() {
    this.dialogService.dialogConfirm("Excluir Classificado", "Deseja realmente excluir o classificado?", "Excluir", "Cancelar", ret => {
      if (ret) {
        this.isProcessing = true;

        this.service.DeleteProduct(this.classifiedId).subscribe(
          result => {
            this.location.back();
          },
          err => {
            this.alert.alertError("Excluir Classificado", err);
              this.isProcessing = false;
          }
        );
      }
    });
  }

  excludeImage(img) {
    const items = this.classified.classified.photos.filter(
      x => x.id !== img.id
    );

    this.classified.classified.photos = items;
  }
}
