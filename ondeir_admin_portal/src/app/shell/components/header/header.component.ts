import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from "@angular/router";

import { OwnerEntity } from '../../../shared/models/owner/ownerEntity';
import { OwnerService } from './../../../shared/services/owner.service';
import { BaseComponent } from '../../../../../../ondeir_admin_shared/base/base.component';
import { LoginResultEntity } from '../../../../../../ondeir_admin_shared/models/auth/loginResult.model';

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent extends BaseComponent implements OnInit {
  @ViewChild('owners') select: ElementRef;

  pushRightClass: string = "push-right";
  processingMessage: string = "Carregando...";
  showMessage: boolean = true;

  processingCityMessage: string = "Carregando...";
  showCityMessage: boolean = true;

  authUser: LoginResultEntity;
  ownerList: Array<OwnerEntity>;
  selectedOwner: OwnerEntity;

  constructor(public router: Router, private service: OwnerService) {
    super(null);
  }

  ngOnInit() {
    this.authUser = this.getLoginInfo();

    this.router.events.subscribe(val => {
      if (
        val instanceof NavigationEnd &&
        window.innerWidth <= 992 &&
        this.isToggled()
      ) {
        this.toggleSidebar();
      }
    });

    this.setAdminProfile();
  }

  setAdminProfile() {
    // Verifica se o usuário é administrador
    if (this.authUser.type >= 2) {
      this.service.ListOwner().subscribe(
        ret => {
          this.ownerList = ret;

          const ow: OwnerEntity = OwnerEntity.getInstance();
          ow.id = -1;
          ow.title = "Selecionar perfil do credenciado";

          this.ownerList.unshift(ow);

          this.processingMessage = "Selecionar perfil do credenciado";
          this.showMessage = false;

          this.selectedOwner = ow;
        },
        err => {
          this.alert.alertError("Listar Credenciados", err);
        }
      );
    }
  }

  onChange() {
    this.showMessage = false;

    if (this.selectedOwner && this.selectedOwner.id > 0) {
      this.authUser = this.getLoginInfo();
      this.authUser.userId = this.selectedOwner.id;
      // this.authUser.userName = this.selectedOwner.ownerName;

      this.setLoginInfo(this.authUser);

      this.router.navigate(["/"]);
    }
  }

  onCityChange() {
    this.authUser = this.getLoginInfo();
    this.authUser.userId = 0;
    this.authUser.cityId = this.loginInfo.cityId;

    this.setLoginInfo(this.authUser);

    this.setAdminProfile();

    this.router.navigate(["/"]);
  }

  isToggled(): boolean {
    const dom: Element = document.querySelector("body");
    return dom.classList.contains(this.pushRightClass);
  }

  toggleSidebar() {
    const dom: any = document.querySelector("body");
    dom.classList.toggle(this.pushRightClass);
  }

  onLoggedout() {
    localStorage.removeItem("isLoggedin");

    // this.loginService.logout(JSON.parse(localStorage.getItem('loginInfo')).authenticationToken);
  }

  toggleSelect() {
    if (this.select) {
      console.log(this.select.nativeElement);
    }
  }
}
