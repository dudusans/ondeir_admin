import { Component, OnInit } from "@angular/core";

import { BaseComponent } from '../../../../../../ondeir_admin_shared/base/base.component';
import { LoginResultEntity } from "../../../../../../ondeir_admin_shared/models/auth/loginResult.model";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"]
})
export class SidebarComponent extends BaseComponent implements OnInit {
  isActive: boolean = false;
  showMenu: string = "";

  authUser: LoginResultEntity;

  constructor() {
    super(null);
  }

  ngOnInit() {
    this.authUser = this.getLoginInfo();
  }

  eventCalled() {
    this.isActive = !this.isActive;
  }

  addExpandClass(element: any) {
    if (element === this.showMenu) {
      this.showMenu = "0";
    } else {
      this.showMenu = element;
    }
  }
}
