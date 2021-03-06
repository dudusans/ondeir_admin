import { ServiceResult } from './../../../ondeir_admin_shared/models/base/serviceResult.model';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { BaseService } from '../../../ondeir_admin_shared/base/base.service';
import { AppConfig } from '../../../ondeir_admin_shared/config/app.config';
import { CrudService } from '../../../ondeir_admin_shared/base/crud.service';

import { StoreEntity } from '../../../ondeir_admin_shared/models/classifieds/store.model';
import { EventEntity } from '../../../ondeir_admin_shared/models/tickets/event.model';
import { TicketTypeEntity } from '../../../ondeir_admin_shared/models/tickets/ticketType.model';
import { SectorEntity } from '../../../ondeir_admin_shared/models/tickets/sector.model';
import { EventPhotoEntity } from '../../../ondeir_admin_shared/models/tickets/eventPhotos.model';
import { EventSalesEntity } from '../../../ondeir_admin_shared/models/tickets/eventSales.model';
import { EventSalesDetailEntity } from '../../../ondeir_admin_shared/models/tickets/eventSalesDetail.model';
import { EventSalesTicketEntity } from '../../../ondeir_admin_shared/models/tickets/eventSalesTicket.model';
import { TicketSaleEntity } from '../../../ondeir_admin_shared/models/tickets/ticketSale.model';

@Injectable()
export class TicketsService extends BaseService {
    
    constructor(config: AppConfig, router: Router, httpClient: HttpClient, public StoreService: CrudService<StoreEntity>) {
        super(config, router, httpClient);
    }

    public Init() {
        this.StoreService.InitService("classifieds/stores", ["id"]);
    }

    public ConsultCEP = (cep: string) : Observable<any> => {
        const serviceUrl = `https://viacep.com.br/ws/${cep}/json/`;

        return this.httpClient
            .get(serviceUrl)
            .map((res: Response) => {
                return (res as any);
            }).catch(this.handleErrorObservable);
    }

    /** Events Custom API */
    public ListEvents = (ownerId: number): Observable<Array<EventEntity>> => {
    
        const serviceUrl = `${this.config.baseUrl}tickets/events/owner/${ownerId}`;

        return this.httpClient
            .get(serviceUrl)
            .map((res: Response) => {
                return (res as any).Result;
            }).catch(this.handleErrorObservable);
    }

    public ListEventsByCity = (cityId: number): Observable<Array<EventEntity>> => {
    
        const serviceUrl = `${this.config.baseUrl}tickets/events/city/${cityId}`;

        return this.httpClient
            .get(serviceUrl)
            .map((res: Response) => {
                return (res as any).Result;
            }).catch(this.handleErrorObservable);
    }

    public ListVouchers = (userId: number): Observable<Array<EventEntity>> => {
    
        const serviceUrl = `${this.config.baseUrl}tickets/vouchers/${userId}`;

        return this.httpClient
            .get(serviceUrl)
            .map((res: Response) => {
                return (res as any).Result;
            }).catch(this.handleErrorObservable);
    }

    public GetVoucher = (id: number): Observable<any> => {
        const serviceUrl = `${this.config.baseUrl}tickets/voucher/${id}`;
    
        return this.httpClient
            .get(serviceUrl)
            .map((res: Response) => {
                const voucher = (res as any).Result;
                voucher.event.date = new Date(voucher.event.date);

                return voucher;
            })
            .catch(this.handleErrorObservable);
    }

    public GetEvent = (id: number): Observable<any> => {
        const serviceUrl = `${this.config.baseUrl}tickets/events/${id}`;
    
        return this.httpClient
            .get(serviceUrl)
            .map((res: Response) => {
                const event = (res as any).Result;
                event.date = new Date(event.date);

                return event;
            })
            .catch(this.handleErrorObservable);
    }

    public GetAnnouncement = (id: number): Observable<any> => {
        const serviceUrl = `${this.config.baseUrl}tickets/announcement/${id}`;
    
        return this.httpClient
            .get(serviceUrl)
            .map((res: Response) => {
                const event = (res as any).Result;
                event.date = new Date(event.date);

                return event;
            })
            .catch(this.handleErrorObservable);
    }

    public GetEventPhotos = (id: number): Observable<Array<EventPhotoEntity>> => {
    
        const serviceUrl = `${this.config.baseUrl}tickets/events/photos/${id}`;

        return this.httpClient
            .get(serviceUrl)
            .map((res: Response) => {
                return (res as any).Result;
            }).catch(this.handleErrorObservable);
    }

    /**
     * GetSector
     */
    public GetSector = (id: number): Observable<any> => {
        const serviceUrl = `${this.config.baseUrl}tickets/sectors/${id}`;
    
        return this.httpClient
            .get(serviceUrl)
            .map((res: Response) => {

                return (res as any).Result;
            })
            .catch(this.handleErrorObservable);
    }

    /**
     * CreateSector
     */
    public CreateSector(ticketType: SectorEntity): Observable<number> {
        const serviceUrl = `${this.config.baseUrl}tickets/sectors`;

        return this.httpClient
            .post(serviceUrl, ticketType)
            .map((res: Response) => {
                return (res as any).Result;
            })
            .catch(this.handleErrorObservable);
    }

    /**
     * Update Sector
     */
    public UpdateSector(ticketType: SectorEntity): Observable<boolean> {
        const serviceUrl = `${this.config.baseUrl}tickets/sectors`;

        return this.httpClient
            .put(serviceUrl, ticketType)
            .map((res: Response) => {
                return (res as any).Result;
            })
            .catch(this.handleErrorObservable);
    }

    /**
     * Delete Sector
     */
    public DeleteSector(ticketTypeId: number): Observable<boolean> {
        const serviceUrl = `${this.config.baseUrl}tickets/sectors/${ticketTypeId}`;
        const body = {
            id: ticketTypeId
        };

        return this.httpClient
            .delete(serviceUrl)
            .map((res: Response) => {
                return (res as any).Executed;
            })
            .catch(this.handleErrorObservable);
    }

    /**
     * GetTicketType
     */
    public GetTicketType = (id: number): Observable<any> => {
        const serviceUrl = `${this.config.baseUrl}tickets/types/${id}`;
    
        return this.httpClient
            .get(serviceUrl)
            .map((res: Response) => {

                return (res as any).Result;
            })
            .catch(this.handleErrorObservable);
    }

    /**
     * CreateTicketType
     */
    public CreateTicketType(ticketType: TicketTypeEntity): Observable<boolean> {
        const serviceUrl = `${this.config.baseUrl}tickets/types`;

        return this.httpClient
            .post(serviceUrl, ticketType)
            .map((res: Response) => {
                return (res as any).Result;
            })
            .catch(this.handleErrorObservable);
    }

    /**
     * Update TicketType
     */
    public UpdateTicketType(ticketType: TicketTypeEntity): Observable<boolean> {
        const serviceUrl = `${this.config.baseUrl}tickets/types`;

        return this.httpClient
            .put(serviceUrl, ticketType)
            .map((res: Response) => {
                return (res as any).Result;
            })
            .catch(this.handleErrorObservable);
    }

    /**
     * Delete TicketType
     */
    public DeleteTicketType(ticketTypeId: number): Observable<boolean> {
        const serviceUrl = `${this.config.baseUrl}tickets/types/${ticketTypeId}`;
        const body = {
            id: ticketTypeId
        };

        return this.httpClient
            .delete(serviceUrl)
            .map((res: Response) => {
                return (res as any).Executed;
            })
            .catch(this.handleErrorObservable);
    }

    public UploadPhotos = (photos: Array<EventPhotoEntity>): Observable<boolean> => {
        const serviceUrl = `${this.config.baseUrl}tickets/events/photos`;

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

    public CreateEvent = (event: EventEntity): Observable<number> => {
        const serviceUrl = `${this.config.baseUrl}tickets/events`;
    
        return this.httpClient
            .post(serviceUrl, event)
            .map((res: Response) => {
                return (res as any).Result;
            })
            .catch(this.handleErrorObservable);
    }

    public UpdateEvent = (event: EventEntity): Observable<number> => {
        const serviceUrl = `${this.config.baseUrl}tickets/events`;

        return this.httpClient
            .put(serviceUrl, event)
            .map((res: Response) => {
                return (res as any).Result;
            })
            .catch(this.handleErrorObservable);
    }

    public DeleteEvent = (id: number): Observable<boolean> => {
        const serviceUrl = `${this.config.baseUrl}tickets/events/${id}`;
    
        return this.httpClient
            .delete(serviceUrl)
            .map((res: Response) => {
                return (res as any).Result;
            })
            .catch(this.handleErrorObservable);
    }

    /** Events Sales Custom API */
    public ListEventsSales = (ownerId: number): Observable<Array<EventSalesEntity>> => {
    
        const serviceUrl = `${this.config.baseUrl}tickets/events/sales/${ownerId}`;

        return this.httpClient
            .get(serviceUrl)
            .map((res: Response) => {
                return (res as any).Result;
            }).catch(this.handleErrorObservable);
    }

    public ListEventsSalesDetail = (eventId: number): Observable<Array<EventSalesDetailEntity>> => {
    
        const serviceUrl = `${this.config.baseUrl}tickets/events/sales/detail/${eventId}`;

        return this.httpClient
            .get(serviceUrl)
            .map((res: Response) => {
                return (res as any).Result;
            }).catch(this.handleErrorObservable);
    }

    public ListEventsSalesTicket = (isNew: boolean, id: number): Observable<Array<EventSalesTicketEntity>> => {
    
        const action: number = isNew ? 1 : 0;
        const serviceUrl = `${this.config.baseUrl}tickets/events/sales/tickets/${action}/${id}`;

        return this.httpClient
            .get(serviceUrl)
            .map((res: Response) => {
                return (res as any).Result;
            }).catch(this.handleErrorObservable);
    }

    /**
     * GetCardTransaction
     */
    public GetCardTransaction = (id: number): Observable<any> => {
        const serviceUrl = `${this.config.baseUrl}tickets/cardtransaction/${id}`;
    
        return this.httpClient
            .get(serviceUrl)
            .map((res: Response) => {
                let card = (res as any).Result
                card.dateTime = new Date(card.dateTime);
                
                return card;
            })
            .catch(this.handleErrorObservable);
    }

    /**
     * GetEventSummary
     */
    public GetEventSummary = (id: number): Observable<any> => {
        const serviceUrl = `${this.config.baseUrl}tickets/events/summary/${id}`;
    
        return this.httpClient
            .get(serviceUrl)
            .map((res: Response) => {

                return (res as any).Result;
            })
            .catch(this.handleErrorObservable);
    }

    /**
     * GetBuyerInfo
     */
    public GetBuyerInfo = (id: number): Observable<any> => {
        const serviceUrl = `${this.config.baseUrl}tickets/buyer/info/${id}`;
    
        return this.httpClient
            .get(serviceUrl)
            .map((res: Response) => {

                return (res as any).Result;
            })
            .catch(this.handleErrorObservable);
    }

    /** ListUsers */
    public ListUsers = (): Observable<Array<EventEntity>> => {
    
        const serviceUrl = `${this.config.baseUrl}users`;

        return this.httpClient
            .get(serviceUrl)
            .map((res: Response) => {
                return (res as any).Result;
            }).catch(this.handleErrorObservable);
    }

    /**
     * Create Ticket Sale
     */
    public CreateSale(body: TicketSaleEntity): Observable<boolean> {
        const serviceUrl = `${this.config.baseUrl}tickets/sales`;
        
        return this.httpClient
            .post(serviceUrl, body)
            .map((res: Response) => {
                return (res as any).Result;
            })
            .catch(this.handleErrorObservable);
    }

    /**
     * Pay Ticket Sales
     */
    public SalesPayment(body: TicketSaleEntity): Observable<boolean> {
        const serviceUrl = `${this.config.baseUrl}tickets/sales/pay`;
        
        return this.httpClient
            .post(serviceUrl, body)
            .map((res: Response) => {
                return (res as any).Result;
            })
            .catch(this.handleErrorObservable);
    }

    /**
     * Delete Ticket Sale
     */
    public DeleteSale(ticketSaleId: number): Observable<boolean> {
        const serviceUrl = `${this.config.baseUrl}tickets/sales/${ticketSaleId}`;
        const body = {
            id: ticketSaleId
        };

        return this.httpClient
            .delete(serviceUrl)
            .map((res: Response) => {
                return (res as any).Executed;
            })
            .catch(this.handleErrorObservable);
    }

    public getSessionId = (email, token): Observable<string> => {
        //Sandbox
        const serviceUrl = `https://ws.sandbox.pagseguro.uol.com.br/v2/authorizations/request/?appId=app2321034764&appKey=E17DD183D7D787DBB4FF2F942F3F63BA`;

        //Produção
        //const serviceUrl = `https://ws.pagseguro.uol.com.br/v2/authorizations/request/?appId=onde-ir-ingressos&appKey=D217232283836E2EE418FF848E90C47D`;

        const body = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <authorizationRequest>
            <permissions>
                <code>RECEIVE_TRANSACTION_NOTIFICATIONS</code>
                <code>SEARCH_TRANSACTIONS</code>
                <code>DIRECT_PAYMENT</code>
            </permissions>
            <redirectURL>http://seusite.com.br/redirect</redirectURL>
        </authorizationRequest>`;

        const header: HttpHeaders = new HttpHeaders();
        header.append("Content-Type", "application/xml");
        header.append("charset", "ISO-8859-1");

        return this.httpClient
            .post(serviceUrl, body, {headers: header } )
            .map((res: Response) => {
                return (res as any).code;
            })
            .catch(this.handleErrorObservable);
    }
}