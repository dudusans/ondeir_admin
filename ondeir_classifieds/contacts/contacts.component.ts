import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../ondeir_admin_shared/base/base.component';
import { AlertService } from '../../ondeir_admin_shared/modules/alert/alert.service';
import { ClassifiedsService } from '../shared/services/classifieds.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent extends BaseComponent implements OnInit {
  contacts: Array<any> = new Array<any>();

  constructor(alert: AlertService, private service: ClassifiedsService) { 
    super(alert);
  }

  ngOnInit() {
    this.isProcessing = true;

    let ownerid = -1;

    if (this.loginInfo.type !== 3) {
      ownerid = this.loginInfo.userId;
    }

    this.service.ListOwnerContacts(ownerid).subscribe(
      ret => {
        this.isProcessing = false;

        this.contacts = ret;
      },
      err => {
        this.isProcessing = false;
        this.alert.alertError("Lojas de Classificados", err);
      }
    );
  }

}
