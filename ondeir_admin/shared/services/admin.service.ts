import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { BaseService } from '../../../ondeir_admin_shared/base/base.service';
import { AppConfig } from '../../../ondeir_admin_shared/config/app.config';
import { CrudService } from '../../../ondeir_admin_shared/base/crud.service';
import { SystemEntity } from '../../../ondeir_admin_shared/models/admin/system.model';

@Injectable()
export class AdminService extends BaseService {
    constructor(config: AppConfig, router: Router, httpClient: HttpClient, public ScreenService: CrudService<SystemEntity>) {
        super(config, router, httpClient);
      }
    
      public Init() {
        this.ScreenService.InitService("admin/systems", ["id"]);
      }
}