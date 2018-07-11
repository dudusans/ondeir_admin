import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsLocaleService } from 'ngx-bootstrap';
import { defineLocale } from 'ngx-bootstrap';
import { ptBrLocale } from 'ngx-bootstrap';

import { BaseComponent } from '../../ondeir_admin_shared/base/base.component';
import { AlertService } from '../../ondeir_admin_shared/modules/alert/alert.service';
import { TicketsService } from './../shared/services/tickets.service';
import { EventPhotoEntity } from '../../ondeir_admin_shared/models/tickets/eventPhotos.model';
import { DialogService } from '../../ondeir_admin_shared/modules/dialog/dialog.service';
import { EventEntity } from '../../ondeir_admin_shared/models/tickets/event.model';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss']
})
export class EventDetailComponent extends BaseComponent implements OnInit {
  public storeType: number = 0;
  public event;
  public eventId: number = 0;
  public isNew: boolean = true;

  public headerTitle: string = "";

  constructor(alert: AlertService, private service: TicketsService, private _localeService: BsLocaleService, private location: Location,
    private route: ActivatedRoute, private formBuilder: FormBuilder, private dialogService: DialogService) {
    super(alert);
  }

  ngOnInit() {
    
    this.initForm();

    // ajustando calendários
    defineLocale('pt-br', ptBrLocale);
    this._localeService.use('pt-br');

    this.route.params.subscribe( params => {
      this.event = EventEntity.GetInstance();

      if (params["id"]){
        this.isNew = false;
        this.headerTitle = "Editar Evento";
        this.eventId = params["id"];
        this.isProcessing = true;

        this.service.GetEvent(this.eventId).subscribe(
          ret => {
            this.isProcessing = false;
            this.event = ret;
          },
          err => {
            this.isProcessing = false;
            this.alert.alertError("Detalhe Evento", err);
          }
        );
      }
    });
  }

  // Inicializa os campos do formulário
  initForm() {
    this.formFields = this.formBuilder.group({
      name: ["", Validators.required],
      dateTime: [null, Validators.required],
      description: ["", Validators.required],
      location: ["", Validators.required],
      classification: ["", Validators.required],
      latitude: [""],
      longitude: [""],
      website: [""],
      facebook: [""],
      instagram: [""],
      warnings: [""]
    });
  }

/*
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
  }*/
}
