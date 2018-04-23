import { IMessageAlert } from "./alert.service";
import { Injectable, EventEmitter } from "@angular/core";

@Injectable()
export class AlertService {
    constructor() {}

    public messageAlert: EventEmitter<IMessageAlert> = new EventEmitter<
        IMessageAlert
    >();

    public alertInformation(title: string, message: string) {
        this.sendAlert(title, message, EAlertType.Information);
    }

    public alertWarning(title: string, message: string) {
        this.sendAlert(title, message, EAlertType.Warning);
    }

    public alertError(title: string, message: string) {
        this.sendAlert(title, message, EAlertType.Error);
    }

    public closeAlert() {
        this.sendAlert("", "", -1);
    }

    private sendAlert(title: string, message: string, type: EAlertType) {
        let alert: IMessageAlert = {
            title: title,
            message: message,
            type: type
        };

        this.messageAlert.emit(alert);
    }
}

export interface IMessageAlert {
    title: string;
    message: string;
    type: EAlertType;
}

export enum EAlertType {
    Information = 1,
    Warning = 2,
    Error = 3
}
