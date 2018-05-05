import { MotorAssemblerEntity } from './../../../ondeir_admin_shared/models/classifieds/motorsAssembler.model';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { BaseService } from '../../../ondeir_admin_shared/base/base.service';
import { AppConfig } from '../../../ondeir_admin_shared/config/app.config';
import { CrudService } from '../../../ondeir_admin_shared/base/crud.service';
import { StoreEntity } from '../../../ondeir_admin_shared/models/classifieds/store.model';
import { ClassifiedEntity } from '../../../ondeir_admin_shared/models/classifieds/classified.model';

@Injectable()
export class ClassifiedsService extends BaseService {
    constructor(config: AppConfig, router: Router, httpClient: HttpClient, public StoreService: CrudService<StoreEntity>) {
        super(config, router, httpClient);
      }
    
      public Init() {
        this.StoreService.InitService("classifieds/stores", ["id"]);
        //this.ClassifiedService.InitService("classifieds/products", ["id"]);
      }

      /** Stores Custom API */
      public ListStores = (): Observable<Array<StoreEntity>> => {
        let city = this.loginInfo.cityId;

        if (this.loginInfo.type === 3) {
          city = -1;
        }
    
        const serviceUrl = `${this.config.baseUrl}classifieds/stores/city/${city}`;
    
            return this.httpClient
                .get(serviceUrl)
                .map((res: Response) => {
                    return (res as any).Result;
                })
                .catch(this.handleErrorObservable);
      }

      public ListOwnerContacts = (ownerId: number): Observable<any> => {
        
        const serviceUrl = `${this.config.baseUrl}classifieds/contacts/${ownerId}`;
    
            return this.httpClient
                .get(serviceUrl)
                .map((res: Response) => {
                    return (res as any).Result;
                })
                .catch(this.handleErrorObservable);
      }

      public ListOwnerProducts = (ownerId: number): Observable<any> => {
        
        const serviceUrl = `${this.config.baseUrl}classifieds/products/owner/${ownerId}`;
    
            return this.httpClient
                .get(serviceUrl)
                .map((res: Response) => {
                    return (res as any).Result;
                })
                .catch(this.handleErrorObservable);
      }

      public ListAssemblers = (): Observable<Array<MotorAssemblerEntity>> => {
        const serviceUrl = `${this.config.baseUrl}classifieds/assemblers`;
    
        return this.httpClient
            .get(serviceUrl)
            .map((res: Response) => {
                return (res as any).Result;
            })
            .catch(this.handleErrorObservable);
      }
}