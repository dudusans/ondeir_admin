import { BaseDAO } from '../baseDAO';
import { CrudDAO } from '../crudDAO';
import { Response } from 'express';

import { BuyerInfoEntity }       from '../../../../ondeir_admin_shared/models/tickets/buyerInfo.model';
import { CardTransactionEntity } from '../../../../ondeir_admin_shared/models/tickets/cardTransaction.model';
import { EventEntity }           from '../../../../ondeir_admin_shared/models/tickets/event.model';
import { SectorEntity }          from '../../../../ondeir_admin_shared/models/tickets/sector.model';
import { TicketSaleEntity }      from '../../../../ondeir_admin_shared/models/tickets/ticketSale.model';
import { TicketTypeEntity }      from '../../../../ondeir_admin_shared/models/tickets/ticketType.model';
import { DbConnection }          from '../../config/dbConnection';
import { isNull } from 'util';

export class TicketsDAO extends BaseDAO {

    private listByDocumentQuery: string = "SELECT * FROM BUYER_INFO WHERE DOCUMENT = ?";
    private listByOwnerQuery: string = "SELECT * FROM EVENTS WHERE OWNER_ID = ?";
    private listByEventQuery: string = "SELECT * FROM SECTOR WHERE EVENT_ID = ?";
    private listBySectorQuery: string = "SELECT *, (AMOUNT - SOLD) AS AVAILABLE FROM TICKETS_TYPE ";
    private listByTypeQuery: string = "SELECT TS.*, TY.SECTOR_ID FROM TICKET_SALES AS TS INNER JOIN TICKETS_TYPE AS TY ON TS.TICKET_TYPE_ID = TY.ID ";
    
    private updateSoldTicketType: string = "UPDATE TICKETS_TYPE SET SOLD = (SOLD + 1) WHERE SECTOR_ID = ? AND ID = ?";
    private cancelSoldTicketType: string = "UPDATE TICKETS_TYPE SET SOLD = (SOLD - 1) WHERE SECTOR_ID = ? AND ID = ?";

    public BuyersInfo: CrudDAO<BuyerInfoEntity> = new CrudDAO<BuyerInfoEntity>(process.env.DB_FIDELIDADE || '', "BUYER_INFO", ["USER_ID"], BuyerInfoEntity);
    public CardTransactions: CrudDAO<CardTransactionEntity> = new CrudDAO<CardTransactionEntity>(process.env.DB_FIDELIDADE || '', "CARD_TRANSACTION", ["SALE_ID"], CardTransactionEntity);
    public Events: CrudDAO<EventEntity> = new CrudDAO<EventEntity>(process.env.DB_FIDELIDADE || '', "EVENTS", ["ID"], EventEntity);
    public Sectors: CrudDAO<SectorEntity> = new CrudDAO<SectorEntity>(process.env.DB_FIDELIDADE || '', "SECTOR", ["ID"], SectorEntity);
    public TicketSales: CrudDAO<TicketSaleEntity> = new CrudDAO<TicketSaleEntity>(process.env.DB_FIDELIDADE || '', "TICKET_SALES", ["ID"], TicketSaleEntity);
    public TicketTypes: CrudDAO<TicketTypeEntity> = new CrudDAO<TicketTypeEntity>(process.env.DB_FIDELIDADE || '', "TICKETS_TYPE", ["ID"], TicketTypeEntity);

    constructor() {
        super();
    }   

    /**
     * List all events of owner in database
    */
    public ListEvents = (ownerId: number, res: Response, callback) => {
        DbConnection.connectionPool.query(this.listByOwnerQuery, ownerId, (error, results) => {
            if (!error) {
                let list: Array<EventEntity>;
                list = results.map(item => {
                    let ownerItem = new EventEntity();
                    ownerItem.fromMySqlDbEntity(item);

                    return ownerItem;
                });

                return callback(res, error, list);
            }

            return callback(res, error, results);
        });
    }

    /**
     * List all sectors of event in database
    */
    public ListSector = (eventId: number, res: Response, callback) => {
        DbConnection.connectionPool.query(this.listByEventQuery, eventId, (error, results) => {
            if (!error) {
                let list: Array<EventEntity>;
                list = results.map(item => {
                    let eventItem = new EventEntity();
                    eventItem.fromMySqlDbEntity(item);

                    return eventItem;
                });

                return callback(res, error, list);
            }

            return callback(res, error, results);
        });
    }

    /**
     * List all tickets of sectors in database
    */
    public ListTicketsType = (sectorId: number, res: Response, callback) => {

        let query: string = this.listBySectorQuery + "WHERE SECTOR_ID = ?";

        DbConnection.connectionPool.query(query, sectorId, (error, results) => {
            if (!error) {
                let list: Array<TicketTypeEntity>;
                list = results.map(item => {
                    let typeItem = new TicketTypeEntity();
                    typeItem.fromMySqlDbEntity(item);
                    typeItem.sectorId = sectorId;

                    return typeItem;
                });

                return callback(res, error, list);
            }

            return callback(res, error, results);
        });
    }

    /**
     * Get tickets of sectors in database
    */
    public GetTicketsType = (id: number, res: Response, callback) => {

        let query = this.listBySectorQuery + "WHERE ID = ?";

        DbConnection.connectionPool.query(query, id, (error, results) => {
            if (!error && results.length > 0) {
                let saleItem = new TicketTypeEntity();
                saleItem.fromMySqlDbEntity(results[0]);

                return callback(res, error, saleItem);
            }

            return callback(res, error, {});
        });
    }

    /**
     * List all tickets of sectors in database
    */
    public ListTicketsSale = (typeId: number, res: Response, callback) => {

        let query = this.listByTypeQuery + "WHERE TS.TICKET_TYPE_ID = ?";

        DbConnection.connectionPool.query(query, typeId, (error, results) => {
            if (!error) {
                let list: Array<TicketSaleEntity>;
                list = results.map(item => {
                    let saleItem = new TicketSaleEntity();
                    saleItem.fromMySqlDbEntity(item);

                    return saleItem;
                });

                return callback(res, error, list);
            }

            return callback(res, error, results);
        });
    }

    /**
     * Get tickets of sectors in database
    */
    public GetTicketsSale = (id: number, res: Response, callback) => {

        let query = this.listByTypeQuery + "WHERE TS.ID = ?";

        DbConnection.connectionPool.query(query, id, (error, results) => {
            if (!error && results.length > 0) {
                let saleItem = new TicketSaleEntity();
                saleItem.fromMySqlDbEntity(results[0]);

                return callback(res, error, saleItem);
            }

            return callback(res, error, {});
        });
    }
    
    /**
     * Update sold tucket type
    */
    public SoldTicketType = (action: number, sectorId: number, typeId: number, res: Response, callback) => {

        let query: string = action == 1 ? this.updateSoldTicketType : this.cancelSoldTicketType;

        DbConnection.connectionPool.query(query, [sectorId,typeId], (error, results) => {

            return callback(res, error, results);
        });
    }

    /**
     * Get or Create Buyer_Info of user
    */
    public GetOrCreateBuyer = (document: string, userId: number, res: Response, callback) => {

        DbConnection.connectionPool.query(this.listByDocumentQuery, document, (error, results) => {
            if (!error && results.length > 0) {
                let buyerItem = new BuyerInfoEntity();
                buyerItem.fromMySqlDbEntity(results[0]);

                return callback(res, error, buyerItem);
            } else {
                let buyer = new BuyerInfoEntity();
                buyer.document = document;
                buyer.userId = userId;

                this.BuyersInfo.CreateItem(buyer, res, (res, error, result) => { 
                    if (error) { 
                        return callback(res, error, {});
                    }
                    
                    return callback(res, error, buyer);
                });
            }
        });
    }
}