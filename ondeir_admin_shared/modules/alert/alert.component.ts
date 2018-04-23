import { Component, OnInit, Input } from "@angular/core";
import {
    trigger,
    state,
    style,
    transition,
    animate,
    keyframes
} from "@angular/animations";

import { EAlertType, AlertService, IMessageAlert } from "./alert.service";

@Component({
    selector: "app-alert",
    templateUrl: "./alert.component.html",
    styleUrls: ["./alert.component.scss"],
    animations: [
        trigger("showAlert", [
            state(
                "close",
                style({
                    transform: "transform: 'translateX(-100%)'"
                })
            ),
            state(
                "show",
                style({
                    transform: "transform: 'translateX(0%)'"
                })
            ),
            transition("close => show", animate("500ms ease-in"))
        ])
    ]
})
export class AlertComponent implements OnInit {
    public alert: IMessageAlert;
    state: string = "close";

    private showAlert: boolean;

    constructor(private service: AlertService) {

    }

    ngOnInit() {
        this.service.messageAlert.subscribe(alert => {
            this.alert = alert;
            this.state = this.state === "close" ? "show" : "close";

            setTimeout(() => {
              this.closeAlert();
            }, 4000);
        });
    }

    closeAlert() {
        this.state = this.state === "close" ? "show" : "close";
        this.alert.type = -1;
    }
}
