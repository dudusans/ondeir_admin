import { Injectable, EventEmitter } from "@angular/core";

@Injectable()
export class DialogService {
  public dialog: EventEmitter<IDialogData> = new EventEmitter<IDialogData>();
  public displayContent: EventEmitter<IDialogContent> = new EventEmitter<IDialogContent>();
  public dialogResult: EventEmitter<boolean> = new EventEmitter<boolean>();

  public dialogInformation(title: string, message: string) {
    this.openDialog(title, message, EDialogType.Information);
}

public dialogPrompt(message: string) {
    this.openDialog("Dialog", message, EDialogType.Prompty);
}

public dialogContent(title: string, content: any, callback, confirmText?: string, cancelText?: string, showConfirm?: boolean) {
  const data: IDialogContent = {
    dialog: {
      title: title,
      type: EDialogType.Content,
      message: "",
      confirmText: confirmText,
      cancelText: cancelText,
      callback: callback,
    },
    content: content,
    showConfirm: showConfirm
  };

  this.displayContent.emit(data);
}

public dialogConfirm(title: string, message: string, confirmText?: string, cancelText?: string, callback?) {
    this.openDialog(title, message, EDialogType.Confirm, confirmText, cancelText, callback);
}

private openDialog(title: string, message: string, type: EDialogType, confirmText: string = "", cancelText: string = "", callback?) {
    const data: IDialogData = {
        title: title,
        message: message,
        type: type,
        confirmText: confirmText,
        cancelText: cancelText,
        callback: callback
    };

    this.dialog.emit(data);
}
}

export interface IDialogData {
  title: string;
  message: string;
  type: EDialogType;
  confirmText: string;
  cancelText: string;
  callback: any;
}

export interface IDialogContent {
  dialog: IDialogData;
  content: any;
  showConfirm: boolean;
}

export enum EDialogType {
  Information = 1,
  Prompty = 2,
  Confirm = 3,
  Content = 4
}
