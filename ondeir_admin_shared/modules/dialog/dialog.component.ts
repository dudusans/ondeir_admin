import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, ElementRef, Directive } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';

import { DialogService, IDialogData, EDialogType, IDialogContent } from './dialog.service';

@Directive({
  selector: '[content-host]',
})
export class AdDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  @ViewChild('template') dialogTemplate;

  componentData = null;
  title: string;
  message: string;
  confirmText: string = "Confirmar";
  cancelText: string = "Cancelar";

  callback: any;

  isConfirm: boolean = false;
  isContent: boolean = false;
  showConfirm: boolean = true;

  modalRef: BsModalRef;

  constructor(private dialogService: DialogService, private modalService: BsModalService) {

  }

  ngOnInit() {
    this.dialogService.dialog.subscribe((dialog: IDialogData) => {
      this.setModalData(dialog);

      this.modalRef = this.modalService.show(this.dialogTemplate);

    });

    this.dialogService.displayContent.subscribe((dialog: IDialogContent) => {
      this.reset();

      this.title = dialog.dialog.title;
      this.isContent = true;
      this.isConfirm = true;

      if (dialog.dialog.confirmText && dialog.dialog.confirmText !== "") {
        this.confirmText = dialog.dialog.confirmText;
      }
      if (dialog.dialog.cancelText && dialog.dialog.cancelText !== "") {
        this.cancelText = dialog.dialog.cancelText;
      }

      if (dialog.showConfirm !== undefined) {
        this.showConfirm = dialog.showConfirm;
      }

      this.callback = dialog.dialog.callback;

      try {
        this.componentData = dialog.content;
      } catch (error) {
        console.log(error);
      }

      this.modalRef = this.modalService.show(this.dialogTemplate);

    });
  }

  reset() {
    this.title = "";
    this.message = "";
    this.isConfirm = false;
    this.isContent = false;
    this.confirmText = "Confirmar";
    this.cancelText = "Cancelar";
    this.showConfirm = false;

    this.callback = null;
  }

  setModalData(dialog: IDialogData) {
    this.reset();

    this.title = dialog.title;
    this.message = dialog.message;

    switch (dialog.type) {
      case EDialogType.Information:
        break;
      case EDialogType.Prompty:
        break;
      case EDialogType.Confirm:
        this.isConfirm = true;
        this.showConfirm = true;
        this.cancelText = dialog.cancelText;
        this.confirmText = dialog.confirmText;
        this.callback = dialog.callback;
        break;
      default:
        break;
    }
  }

  close() {
    this.modalRef.hide();
  }

  emitDialogResult(result) {
    if (this.callback) {
      if (result) {
        this.callback(result);
      }
    } else {
      this.dialogService.dialogResult.emit(result);
    }

    this.modalRef.hide();
  }
}
