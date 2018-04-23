import { Component, OnInit } from "@angular/core";

import { BaseComponent } from '../../../../../../ondeir_admin_shared/base/base.component';
import { LoginResultEntity } from "../../../../../../ondeir_admin_shared/models/auth/loginResult.model";
import { AuthService } from "../../../shared/services/auth.service";
import { SystemEntity } from '../../../../../../ondeir_admin_shared/models/admin/system.model';

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"]
})
export class SidebarComponent extends BaseComponent implements OnInit {
  isActive: boolean = false;
  showMenu: string = "";

  authUser: LoginResultEntity;

  menu: Array<SystemEntity> = new Array<SystemEntity>();


  constructor(private service: AuthService) {
    super(null);
  }

  ngOnInit() {
    this.authUser = this.getLoginInfo();

    if (this.authUser.type >= 2) {
      this.service.GetAdminMenu().subscribe(
        ret => {
          this.menu = ret.sort((obj1, obj2) => {
            return obj1.menuOrder - obj2.menuOrder;
          });
        },
        err => {
          this.menu = new Array<SystemEntity>();
        }
      );
    } else {
      this.service.GetOwnerMenu(this.authUser.userId).subscribe(
        ret => {
          this.menu = ret.sort((obj1, obj2) => {
            return obj1.menuOrder - obj2.menuOrder;
          });
        },
        err => {
          this.menu = new Array<SystemEntity>();
        }
      );
    }
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
