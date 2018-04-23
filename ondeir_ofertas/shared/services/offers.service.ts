import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";

import { OffersEntity } from '../../../ondeir_admin_shared/models/offers/offers.model';
import { EOfferStatus } from '../../../ondeir_admin_shared/models/offers/offers.model';
import { BaseService } from '../../../ondeir_admin_shared/base/base.service';
import { AppConfig } from './../../../ondeir_admin_shared/config/app.config';

@Injectable()
export class OffersService extends BaseService {


  constructor(private clientHttp: HttpClient, config: AppConfig, router: Router) {
    super(config, router);
  }

  public ListOffers(ownerId: number): Observable<Array<OffersEntity>> {
    const serviceUrl = `${this.config.baseUrl}offers/list/${ownerId}`;

        return this.clientHttp
            .get(serviceUrl)
            .map((res: Response) => {
                return (res as any).Result;
            })
            .catch(this.handleErrorObservable);
  }

  public ListOffersStatus(ownerId: number, status: string): Observable<Array<OffersEntity>> {
    const serviceUrl = `${this.config.baseUrl}offers/list/${ownerId}/${status}`;

        return this.clientHttp
            .get(serviceUrl)
            .map((res: Response) => {
                return (res as any).Result;
            })
            .catch(this.handleErrorObservable);
  }

  public ListUserOffers(userId: number): Observable<Array<OffersEntity>> {
    const serviceUrl = `${this.config.baseUrl}offers/user/${userId}`;

    return this.clientHttp
            .get(serviceUrl)
            .map((res: Response) => {
                return (res as any).Result;
            })
            .catch(this.handleErrorObservable);
  }

  public SearchOffers(cityId: number): Observable<Array<OffersEntity>> {
    const serviceUrl = `${this.config.baseUrl}offers/search/${cityId}`;

    return this.clientHttp
            .get(serviceUrl)
            .map((res: Response) => {
                return (res as any).Result;
            })
            .catch(this.handleErrorObservable);
  }

  public GetOffers(OffersId: number): Observable<OffersEntity> {
    const serviceUrl = `${this.config.baseUrl}offers/${OffersId}`;

    return this.clientHttp
            .get(serviceUrl)
            .map((res: Response) => {
                const offers = (res as any).Result;
                offers.startDate = new Date(offers.startDate);
                offers.endDate = new Date(offers.endDate);

                return offers;
            })
            .catch(this.handleErrorObservable);
  }

  public GetOfferHash(qrHash: string, userId: number): Observable<OffersEntity> {
    const serviceUrl = `${this.config.baseUrl}offers/${qrHash}/${userId}`;

    return this.clientHttp
            .get(serviceUrl)
            .map((res: Response) => {
                const offers = (res as any).Result;
                offers.startDate = new Date(offers.startDate);
                offers.endDate = new Date(offers.endDate);

                return offers;
            })
            .catch(this.handleErrorObservable);
  }

  public DeleteOffers(OffersId: number): Observable<boolean> {
    const serviceUrl = `${this.config.baseUrl}offers/${OffersId}`;

    return this.clientHttp
            .delete(serviceUrl)
            .map((res: Response) => {
                return (res as any).Executed;
            })
            .catch(this.handleErrorObservable);
  }

  /**
   * Create a new Offers
   */
  public CreateOffers(offers: OffersEntity): Observable<boolean> {
    const serviceUrl = `${this.config.baseUrl}offers`;

    return this.clientHttp
            .post(serviceUrl, offers)
            .map((res: Response) => {
                return (res as any).Executed;
            })
            .catch(this.handleErrorObservable);
  }

  /**
   * Update Offers informations
   */
  public UpdateOffers(offers: OffersEntity): Observable<boolean> {
    const serviceUrl = `${this.config.baseUrl}offers`;

    return this.clientHttp
            .put(serviceUrl, offers)
            .map((res: Response) => {
                return (res as any).Executed;
            })
            .catch(this.handleErrorObservable);
  }

  /** Ativação e Inativação de campanha de oferta */
  public ActiveOffers(offerId: number): Observable<boolean> {
    const serviceUrl = `${this.config.baseUrl}offers/activate`;
    const body = {
      id: offerId
    };

    return this.clientHttp
            .post(serviceUrl, body)
            .map((res: Response) => {
                return (res as any).Executed;
            })
            .catch(this.handleErrorObservable);
  }

  public InactiveOffers(OfferId: number): Observable<boolean> {
    const serviceUrl = `${this.config.baseUrl}offers/deactivate`;
    const body = {
      id: OfferId
    };

    return this.clientHttp
            .post(serviceUrl, body)
            .map((res: Response) => {
                return (res as any).Executed;
            })
            .catch(this.handleErrorObservable);
  }

  public createCoupon = (userId: number, offerId: number): Observable<boolean>  => {
    const serviceUrl = `${this.config.baseUrl}offers/createCoupon`;
    const body = {
      offerId: offerId,
      userId: userId
    };

    return this.clientHttp
            .post(serviceUrl, body)
            .map((res: Response) => {
                return (res as any).Executed;
            })
            .catch(this.handleErrorObservable);
  }

  public UseCoupon = (userId: number, offerId: number): Observable<boolean> => {
    const serviceUrl = `${this.config.baseUrl}offers/useCoupon`;
    const body = {
      offerId: offerId,
      userId: userId
    };

    return this.clientHttp
            .post(serviceUrl, body)
            .map((res: Response) => {
                return (res as any).Executed;
            })
            .catch(this.handleErrorObservable);
  }
}
