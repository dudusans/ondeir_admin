import { ServiceResult } from './../../../ondeir_admin_shared/models/base/serviceResult.model';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { BaseService } from '../../../ondeir_admin_shared/base/base.service';
import { AppConfig } from '../../../ondeir_admin_shared/config/app.config';
import { CrudService } from '../../../ondeir_admin_shared/base/crud.service';
import { StoreEntity } from '../../../ondeir_admin_shared/models/classifieds/store.model';
import { ClassifiedEntity } from '../../../ondeir_admin_shared/models/classifieds/classified.model';
import { MotorsEntity } from './../../../ondeir_admin_shared/models/classifieds/motors.model';
import { MotorAssemblerEntity } from './../../../ondeir_admin_shared/models/classifieds/motorsAssembler.model';
import { ClassifiedPhotoEntity } from '../../../ondeir_admin_shared/models/classifieds/classifiedPhotos.model';

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

      public CreateCarAd = (car: MotorsEntity): Observable<number> => {
        const serviceUrl = `${this.config.baseUrl}classifieds/products/motors`;
    
        return this.httpClient
            .post(serviceUrl, car)
            .map((res: Response) => {
                return (res as any).Result;
            })
            .catch(this.handleErrorObservable);
      }

      public UpdateCarAd = (car: MotorsEntity): Observable<number> => {
        const serviceUrl = `${this.config.baseUrl}classifieds/products/motors`;
    
        return this.httpClient
            .put(serviceUrl, car)
            .map((res: Response) => {
                return (res as any).Result;
            })
            .catch(this.handleErrorObservable);
      }

      public GetProduct = (type: number, id: number): Observable<any> => {
        const serviceUrl = `${this.config.baseUrl}classifieds/products/${type}/${id}`;
    
        return this.httpClient
            .get(serviceUrl)
            .map((res: Response) => {
                return (res as any).Result;
            })
            .catch(this.handleErrorObservable);
      }
      
      public UploadPhotos = (photos: Array<ClassifiedPhotoEntity>): Observable<boolean> => {
        const serviceUrl = `${this.config.baseUrl}classifieds/products/photos`;

        let body = {
            photos: photos
        }
    
        return this.httpClient
            .post(serviceUrl, body)
            .map((res: Response) => {
                return (res as any).Result;
            })
            .catch(this.handleErrorObservable);
      }

      public DeleteProduct = (id: number): Observable<boolean> => {
        const serviceUrl = `${this.config.baseUrl}classifieds/products/${id}`;
    
        return this.httpClient
            .delete(serviceUrl)
            .map((res: Response) => {
                return (res as any).Result;
            })
            .catch(this.handleErrorObservable);
      }

      public ListCars = (cityId: number, assembler: number): Observable<any> => {
        const serviceUrl = `${this.config.baseUrl}classifieds/cars/${cityId}/${assembler}`;
    
        return this.httpClient
            .get(serviceUrl)
            .map((res: Response) => {
                return (res as any).Result;
            })
            .catch(this.handleErrorObservable);
      }

      public GetCar = (id: number) : Observable<MotorsEntity> => {
        const serviceUrl = `${this.config.baseUrl}classifieds/products/1/${id}`;
    
        return this.httpClient
            .get(serviceUrl)
            .map((res: Response) => {
                return (res as any).Result;
            })
            .catch(this.handleErrorObservable);
      }
}