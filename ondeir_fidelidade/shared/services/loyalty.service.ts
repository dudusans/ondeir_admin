import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";

import { LoyaltyEntity } from '../../../ondeir_admin_shared/models/loyalty/loyalty';
import { LoyaltyProgramEntity } from '../../../ondeir_admin_shared/models/loyalty/loyaltyProgram';
import { BaseService } from '../../../ondeir_admin_shared/base/base.service';
import { AppConfig } from './../../../ondeir_admin_shared/config/app.config';

@Injectable()
export class LoyaltyService extends BaseService {


  constructor(private clientHttp: HttpClient, config: AppConfig, router: Router) {
    super(config, router);
  }

  public ListLoyalty(ownerId: number): Observable<Array<LoyaltyEntity>> {
    const serviceUrl = `${this.config.baseUrl}loyalty/list/${ownerId}`;

        return this.clientHttp
            .get(serviceUrl)
            .map((res: Response) => {
                return (res as any).Result;
            })
            .catch(this.handleErrorObservable);
  }

  public ListLoyaltyByStatus(ownerId: number, status: string): Observable<Array<LoyaltyEntity>> {
    const serviceUrl = `${this.config.baseUrl}loyalty/list/${ownerId}/${status}`;

        return this.clientHttp
            .get(serviceUrl)
            .map((res: Response) => {
                return (res as any).Result;
            })
            .catch(this.handleErrorObservable);
  }

  public ListUserLoyalty(userId: number): Observable<Array<LoyaltyEntity>> {
    const serviceUrl = `${this.config.baseUrl}loyalty/user/${userId}`;

        return this.clientHttp
            .get(serviceUrl)
            .map((res: Response) => {
                return (res as any).Result;
            })
            .catch(this.handleErrorObservable);
  }

  public GetLoyalty(loyaltyId: number): Observable<LoyaltyEntity> {
    const serviceUrl = `${this.config.baseUrl}loyalty/${loyaltyId}`;

    return this.clientHttp
            .get(serviceUrl)
            .map((res: Response) => {
                const loyalty = (res as any).Result;
                loyalty.startDate = new Date(loyalty.startDate);
                loyalty.endDate = new Date(loyalty.endDate);

                return loyalty;
            })
            .catch(this.handleErrorObservable);
  }

  public GetLoyaltyProgram(qrHash: string, userId: number): Observable<LoyaltyProgramEntity> {
    const serviceUrl = `${this.config.baseUrl}loyalty/${qrHash}/${userId}`;

    return this.clientHttp
            .get(serviceUrl)
            .map((res: Response) => {
                const loyalty = (res as any).Result;

                return loyalty;
            })
            .catch(this.handleErrorObservable);
  }

  public SearchLoyalty(cityId: number): Observable<Array<LoyaltyEntity>> {
    const serviceUrl = `${this.config.baseUrl}loyalty/search/${cityId}`;

    return this.clientHttp
            .get(serviceUrl)
            .map((res: Response) => {
                return (res as any).Result;
            })
            .catch(this.handleErrorObservable);
  }

  public ActiveLoyalty(loyaltyId: number): Observable<boolean> {
    const serviceUrl = `${this.config.baseUrl}loyalty/activate`;
    const body = {
      id: loyaltyId
    };

    return this.clientHttp
            .post(serviceUrl, body)
            .map((res: Response) => {
                return (res as any).Result;
            })
            .catch(this.handleErrorObservable);
  }

  public InactiveLoyalty(loyaltyId: number): Observable<boolean> {
    const serviceUrl = `${this.config.baseUrl}loyalty/deactivate`;
    const body = {
      id: loyaltyId
    };

    return this.clientHttp
            .post(serviceUrl, body)
            .map((res: Response) => {
                return (res as any).Result;
            })
            .catch(this.handleErrorObservable);
  }

  public DeleteLoyalty(loyaltyId: number): Observable<boolean> {
    const serviceUrl = `${this.config.baseUrl}loyalty/${loyaltyId}`;
    const body = {
      id: loyaltyId
    };

    return this.clientHttp
            .delete(serviceUrl)
            .map((res: Response) => {
                return (res as any).Executed;
            })
            .catch(this.handleErrorObservable);
  }

  /**
   * CreateLoyalty
   */
  public CreateLoyalty(loyalty: LoyaltyEntity): Observable<boolean> {
    const serviceUrl = `${this.config.baseUrl}loyalty`;

    return this.clientHttp
            .post(serviceUrl, loyalty)
            .map((res: Response) => {
                return (res as any).Result;
            })
            .catch(this.handleErrorObservable);
  }

  /**
   * Update Loyalty
   */
  public UpdateLoyalty(loyalty: LoyaltyEntity): Observable<boolean> {
    const serviceUrl = `${this.config.baseUrl}loyalty`;

    return this.clientHttp
            .put(serviceUrl, loyalty)
            .map((res: Response) => {
                return (res as any).Result;
            })
            .catch(this.handleErrorObservable);
  }
}
