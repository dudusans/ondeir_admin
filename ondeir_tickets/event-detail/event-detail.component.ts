import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  public event;
  public eventId: number = 0;
  public isNew: boolean = true;

  public headerTitle: string = "";

  constructor(alert: AlertService, private service: TicketsService, private _localeService: BsLocaleService, private location: Location,
    private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder, private dialogService: DialogService) {
    super(alert);
  }

  ngOnInit() {
    
    this.initForm();

    // ajustando calendários
    defineLocale('pt-br', ptBrLocale);
    this._localeService.use('pt-br');

    this.route.params.subscribe( params => {
      this.event = EventEntity.GetInstance();

      if (params["id"]) {
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
      } else {
        this.isNew = true;
        this.headerTitle = "Criar novo Evento";
      }
    });
  }

  // Inicializa os campos do formulário
  initForm() {
    this.formFields = this.formBuilder.group({
      name: ["", Validators.required],
      date: [null, Validators.required],
      description: ["", Validators.required],
      location: ["", Validators.required],
      classification: ["", Validators.required],
      timeBegin: ["", Validators.required],
      timeEnd: ["", Validators.required],
      website: [""],
      facebook: [""],
      instagram: [""],
      warnings: [""]
    });
  }


  // Photos Upload Methods
  onUploadFinished(upload) {
    const photo: EventPhotoEntity = new EventPhotoEntity();
    photo.fileName = upload.file.name;
    photo.image = upload.src;

    this.event.photos.push(photo);
  }

  onRemoved(upload) {
    const items = this.event.photos.filter(
      x => x.fileName !== upload.file.name
    );

    this.event.photos = items;
  }

  uploadPhotos(photos) {
    if (photos && photos.length > 0){
      this.service.UploadPhotos(photos).subscribe(
        ret => {
          this.isProcessing = false;
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

  create() {
    this.event.ownerId = this.loginInfo.userId;

    this.service.CreateEvent(this.event).subscribe(
      ret => {
        this.eventId = ret;

        this.event.photos.forEach(element => {
          element.eventId = ret;
        });

        this.uploadPhotos(this.event.photos);

        this.alert.alertInformation("Novo Evento", "O Evento foi criado com sucesso");
        this.location.go("/tickets/events");
        this.router.navigateByUrl('/tickets/events/details/' + this.eventId);
      },
      err => {
        this.isProcessing = false;
        this.alert.alertError("Criar novo evento", err);
      }
    );
  }

  update() {
    this.event.ownerId = this.loginInfo.userId;

    this.service.UpdateEvent(this.event).subscribe(
      ret => {
        this.eventId = ret;

        this.event.photos.forEach(element => {
          element.eventId = ret;
        });

        this.uploadPhotos(this.event.photos);

        this.alert.alertInformation("Alterar Evento", "O Evento foi atualizado com sucesso");
      },
      err => {
        this.isProcessing = false;
        this.alert.alertError("Alterar evento", err);
      }
    );
  }

  //Screen Methods
  onSave() {
    this.isProcessing = true;
    window.scroll(0,0);

    if (this.isNew){
      return this.create();
    } else {
      this.update();
    }
  }

  onDelete() {
    this.dialogService.dialogConfirm("Excluir Evento", "Deseja realmente excluir o evento?", "Excluir", "Cancelar", ret => {
      if (ret) {
        this.isProcessing = true;

        this.service.DeleteEvent(this.eventId).subscribe(
          result => {
            this.router.navigateByUrl('/tickets/events');
          },
          err => {
            this.alert.alertError("Excluir Evento", err);
              this.isProcessing = false;
          }
        );
      }
    });
  }

  excludeImage(img) {
    const items = this.event.photos.filter(
      x => x.id !== img.id
    );

    this.event.photos = items;
  }
}
