import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";

import { BaseService } from '../../../ondeir_admin_shared/base/base.service';
import { AppConfig } from '../../../ondeir_admin_shared/config/app.config';


@Injectable()
export class ReportsService extends BaseService {


  constructor(private clientHttp: HttpClient, config: AppConfig, router: Router) {
    super(config, router);
  }

  public GetLoyaltyNumber(ownerId: number): Observable<number> {
    const serviceUrl = `${this.config.baseUrl}reports/dashboard/loyalties/${ownerId}`;

        return this.clientHttp
            .get(serviceUrl)
            .map((res: Response) => {
                return (res as any).Result;
            })
            .catch(this.handleErrorObservable);
  }

  public GetOffersNumber(ownerId: number): Observable<number> {
    const serviceUrl = `${this.config.baseUrl}reports/dashboard/offers/${ownerId}`;

        return this.clientHttp
            .get(serviceUrl)
            .map((res: Response) => {
                return (res as any).Result;
            })
            .catch(this.handleErrorObservable);
  }

  public GetProgramsNumber(ownerId: number): Observable<number> {
    const serviceUrl = `${this.config.baseUrl}reports/dashboard/clients/${ownerId}`;

        return this.clientHttp
            .get(serviceUrl)
            .map((res: Response) => {
                return (res as any).Result;
            })
            .catch(this.handleErrorObservable);
  }

  public GetCouponsNumber(ownerId: number): Observable<number> {
    const serviceUrl = `${this.config.baseUrl}reports/dashboard/coupons/${ownerId}`;

        return this.clientHttp
            .get(serviceUrl)
            .map((res: Response) => {
                return (res as any).Result;
            })
            .catch(this.handleErrorObservable);
  }

  public ListLoyaltyPrograms(ownerId: number): Observable<any> {
    const serviceUrl = `${this.config.baseUrl}reports/loyaltyprogram/${ownerId}`;

        return this.clientHttp
            .get(serviceUrl)
            .map((res: Response) => {
                return (res as any).Result;
            })
            .catch(this.handleErrorObservable);
  }

  public ListCoupons(ownerId: number): Observable<any> {
    const serviceUrl = `${this.config.baseUrl}reports/coupons/${ownerId}`;

        return this.clientHttp
            .get(serviceUrl)
            .map((res: Response) => {
                return (res as any).Result;
            })
            .catch(this.handleErrorObservable);
  }

  public ListClients(ownerId: number): Observable<any> {
    const serviceUrl = `${this.config.baseUrl}reports/clients/${ownerId}`;

        return this.clientHttp
            .get(serviceUrl)
            .map((res: Response) => {
                return (res as any).Result;
            })
            .catch(this.handleErrorObservable);
  }
}
