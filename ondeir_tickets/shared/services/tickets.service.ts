import { ServiceResult } from './../../../ondeir_admin_shared/models/base/serviceResult.model';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { BaseService } from '../../../ondeir_admin_shared/base/base.service';
import { AppConfig } from '../../../ondeir_admin_shared/config/app.config';
import { CrudService } from '../../../ondeir_admin_shared/base/crud.service';

import { StoreEntity } from '../../../ondeir_admin_shared/models/classifieds/store.model';
import { EventEntity } from '../../../ondeir_admin_shared/models/tickets/event.model';
import { TicketTypeEntity } from '../../../ondeir_admin_shared/models/tickets/ticketType.model';
import { SectorEntity } from '../../../ondeir_admin_shared/models/tickets/sector.model';

@Injectable()
export class TicketsService extends BaseService {
    
    constructor(config: AppConfig, router: Router, httpClient: HttpClient, public StoreService: CrudService<StoreEntity>) {
        super(config, router, httpClient);
    }

    public Init() {
        this.StoreService.InitService("classifieds/stores", ["id"]);
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

    public GetEvent = (id: number): Observable<any> => {
        const serviceUrl = `${this.config.baseUrl}tickets/events/${id}`;
    
        return this.httpClient
            .get(serviceUrl)
            .map((res: Response) => {
                const event = (res as any).Result;
                event.dateTime = new Date(event.dateTime);

                return event;
            })
            .catch(this.handleErrorObservable);
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
    public CreateSector(ticketType: SectorEntity): Observable<boolean> {
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
}