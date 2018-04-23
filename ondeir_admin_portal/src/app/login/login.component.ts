import { Component, OnInit, TemplateRef } from "@angular/core";
import { Router } from "@angular/router";
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Md5 } from "ts-md5";

import { AuthService } from './../shared/services/auth.service';
import { Utils } from '../../../../ondeir_admin_shared/utils/Utils';
import { AlertService } from '../../../../ondeir_admin_shared/modules/alert/alert.service';
import { BaseComponent } from '../../../../ondeir_admin_shared/base/base.component';
import { LoginResultEntity } from "../../../../ondeir_admin_shared/models/auth/loginResult.model";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent extends BaseComponent implements OnInit {
  user: string = "";
  pass: string = "";

  email: string = "";
  modalRef: BsModalRef;

  constructor(private router: Router, alert: AlertService, private authService: AuthService, private modalService: BsModalService) {
    super(alert);
  }

  ngOnInit() {
  }

  onLoggedin() {
    if (this.user === "" || this.pass === "") {
      return;
    }

    this.isProcessing = true;
    const authUser = LoginResultEntity.GetInstance();

    if (this.user === "admin" && this.pass === "admin") {
      // Usuário de desenvolvimento
      authUser.authenticationToken = "qwert";
      authUser.loginAccept = true;
      authUser.userName = "Administrator Mode";
      authUser.type = 2;
      authUser.userId = 0;
      authUser.cityId = 21; // Curitiba

      this.setSession(authUser);
    } else {
      if (Utils.validateEmail(this.user)) {
        // login usuário do sistema
        this.authService.Login(this.user, this.pass).subscribe(
          ret => {
            if (ret.loginAccept) {
              this.setSession(ret);
            } else {
              this.isProcessing = false;
              this.alert.alertWarning("Login", "Tentativa de acesso não autorizada");
            }
          },
          err => {
            this.alert.alertError("Login", err);
            this.isProcessing = false;
          }
        );

      } else {
        // login Onde Ir
        this.authService.OndeIrLogin(this.user, Md5.hashStr(this.pass).toString()).subscribe(
          ret => {
            if (ret.loginAccept) {
              this.setSession(ret);
            } else {
              this.isProcessing = false;
              this.alert.alertWarning("Login", "Tentativa de acesso não autorizada");
            }
          },
          err => {
            this.alert.alertError("Login", err);
            this.isProcessing = false;
          }
        );


        this.isProcessing = false;
      }
    }
  }

  private setSession(authUser) {
    this.isProcessing = false;

    // Authenticando usuário
    localStorage.setItem('isLoggedin', 'true');
    localStorage.setItem('authUser', JSON.stringify(authUser));

    this.router.navigate(['dashboard']);
  }

  openUpdatePasswordModel(template: TemplateRef<any>) {
    this.email = "";

    this.modalRef = this.modalService.show(template);
  }

  resetPassword() {
    if (this.email === "") {
      return;
    }

    if (!Utils.validateEmail(this.email)) {
      this.alert.alertWarning("Reset Senha", "Email inválido");
      return;
    }

    this.isProcessing = true;

    this.authService.ResetPassword(this.email).subscribe(
      ret => {
        this.isProcessing = false;
        this.email = "";

        this.alert.alertInformation("Reset Senha", "Uma nova senha foi enviada para o e-mail informado.");
        this.modalRef.hide();
      },
      err => {
        this.isProcessing = false;
        this.alert.alertError("Reset Senha", err);
      }
    );
  }
}
