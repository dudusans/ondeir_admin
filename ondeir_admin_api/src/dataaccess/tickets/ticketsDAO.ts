import { BaseDAO } from '../baseDAO';
import { CrudDAO } from '../crudDAO';
import { Response } from 'express';

import { DbConnection }           from '../../config/dbConnection';
import { BuyerInfoEntity }        from '../../../../ondeir_admin_shared/models/tickets/buyerInfo.model';
import { CardTransactionEntity }  from '../../../../ondeir_admin_shared/models/tickets/cardTransaction.model';
import { EventEntity }            from '../../../../ondeir_admin_shared/models/tickets/event.model';
import { SectorEntity }           from '../../../../ondeir_admin_shared/models/tickets/sector.model';
import { TicketSaleEntity }       from '../../../../ondeir_admin_shared/models/tickets/ticketSale.model';
import { TicketTypeEntity }       from '../../../../ondeir_admin_shared/models/tickets/ticketType.model';
import { VoucherEntity }          from '../../../../ondeir_admin_shared/models/tickets/voucher.model';
import { EventPhotoEntity }       from '../../../../ondeir_admin_shared/models/tickets/eventPhotos.model';
import { EventSalesEntity }       from '../../../../ondeir_admin_shared/models/tickets/eventSales.model';
import { EventSalesDetailEntity } from '../../../../ondeir_admin_shared/models/tickets/eventSalesDetail.model';
import { EventSalesTicketEntity } from '../../../../ondeir_admin_shared/models/tickets/eventSalesTicket.model';

export class TicketsDAO extends BaseDAO {

    private listEventsQuery:      string = "SELECT E.* FROM EVENTS AS E";
    private listByEventQuery:     string = "SELECT * FROM SECTOR WHERE EVENT_ID = ?";
    private listBySectorQuery:    string = "SELECT *, (AMOUNT - SOLD) AS AVAILABLE FROM TICKETS_TYPE ";
    private listByTypeQuery:      string = "SELECT * FROM TICKET_SALES ";
    
    private updateSoldTicketType: string = "UPDATE TICKETS_TYPE SET SOLD = (SOLD + ?) WHERE SECTOR_ID = ? AND ID = ?";
    private cancelSoldTicketType: string = "UPDATE TICKETS_TYPE SET SOLD = (SOLD - ?) WHERE SECTOR_ID = ? AND ID = ?";
    private clearEventPhotosQuery: string = "DELETE FROM EVENT_PHOTOS WHERE EVENT_ID = ?";

    public BuyersInfo: CrudDAO<BuyerInfoEntity> = new CrudDAO<BuyerInfoEntity>(process.env.DB_FIDELIDADE || '', "BUYER_INFO", ["USER_ID"], BuyerInfoEntity);
    public CardTransactions: CrudDAO<CardTransactionEntity> = new CrudDAO<CardTransactionEntity>(process.env.DB_FIDELIDADE || '', "CARD_TRANSACTION", ["ID"], CardTransactionEntity);
    public Events: CrudDAO<EventEntity> = new CrudDAO<EventEntity>(process.env.DB_FIDELIDADE || '', "EVENTS", ["ID"], EventEntity);
    public Sectors: CrudDAO<SectorEntity> = new CrudDAO<SectorEntity>(process.env.DB_FIDELIDADE || '', "SECTOR", ["ID"], SectorEntity);
    public TicketSales: CrudDAO<TicketSaleEntity> = new CrudDAO<TicketSaleEntity>(process.env.DB_FIDELIDADE || '', "TICKET_SALES", ["ID"], TicketSaleEntity);
    public TicketTypes: CrudDAO<TicketTypeEntity> = new CrudDAO<TicketTypeEntity>(process.env.DB_FIDELIDADE || '', "TICKETS_TYPE", ["ID"], TicketTypeEntity);
    public Vouchers: CrudDAO<VoucherEntity> = new CrudDAO<VoucherEntity>(process.env.DB_FIDELIDADE || '', "VOUCHERS", ["ID"], VoucherEntity);
    public EventPhotos: CrudDAO<EventPhotoEntity> = new CrudDAO<EventPhotoEntity>(process.env.DB_FIDELIDADE || '', "EVENT_PHOTOS", ["ID"], EventPhotoEntity);

    constructor() {
        super();
    }   

    /**
     * List all events of owner in database
    */
    public ListVouchersByUserId = (userId: number, res: Response, callback) => {

        let query: string = "SELECT E.ID, E.NAME, E.DATE, E.TIME_BEGIN, E.TIME_END, EP.IMAGE_URL, V.ID AS VOUCHER_ID, TT.NAME AS TYPE_NAME, S.NAME AS SECTOR_NAME " +
                            "FROM VOUCHERS AS V " +
                            "INNER JOIN TICKETS_TYPE AS TT ON V.TICKET_TYPE_ID = TT.ID " +
                            "INNER JOIN SECTOR AS S ON TT.SECTOR_ID = S.ID " +
                            "INNER JOIN EVENTS AS E ON S.EVENT_ID = E.ID  " +
                            "LEFT OUTER JOIN EVENT_PHOTOS EP on E.ID = EP.EVENT_ID " +
                            "WHERE V.USER_ID = ? " +
                            "GROUP BY V.ID " +
                            "ORDER BY E.DATE, E.NAME";

        DbConnection.connectionPool.query(query, [userId], (error, results) => {
            if (!error) {
                let list: Array<VoucherEntity>;
                list = results.map(item => {
                    let voucher = new VoucherEntity();
                    voucher.id = item.VOUCHER_ID;
                    voucher.event = new EventEntity();
                    voucher.event.fromMySqlDbEntity(item);
                    voucher.sector = new SectorEntity();
                    voucher.sector.name = item.SECTOR_NAME;
                    voucher.ticketType = new TicketTypeEntity();
                    voucher.ticketType.name = item.TYPE_NAME;

                    return voucher;
                });

                return callback(res, error, list);
            }

            return callback(res, error, results);
        });
    }

    public GetVoucher = (voucherId: number, res: Response, callback) => {

        let query: string = "SELECT V.ID AS VOUCHER_ID, V.QR_HASH, E.ID, E.NAME, E.DATE, E.TIME_BEGIN, E.TIME_END, E.DESCRIPTION, E.LOCATION, E.CLASSIFICATION, E.FACEBOOK, E.INSTAGRAM, E.WEBSITE, TT.NAME AS TYPE_NAME, S.NAME AS SECTOR_NAME " +
                            "FROM VOUCHERS AS V " +
                            "INNER JOIN TICKETS_TYPE AS TT ON V.TICKET_TYPE_ID = TT.ID " +
                            "INNER JOIN SECTOR AS S ON TT.SECTOR_ID = S.ID " +
                            "INNER JOIN EVENTS AS E ON S.EVENT_ID = E.ID  " +
                            "WHERE V.ID = ? ";

        DbConnection.connectionPool.query(query, [voucherId], (error, results) => {
            if (!error && results && results.length > 0) {
                let voucher = new VoucherEntity();
                var item = results[0];

                voucher.id = item.VOUCHER_ID;
                voucher.qrHash = item.QR_HASH;
                voucher.event = new EventEntity();
                voucher.event.fromMySqlDbEntity(item);
                voucher.sector = new SectorEntity();
                voucher.sector.name = item.SECTOR_NAME;
                voucher.ticketType = new TicketTypeEntity();
                voucher.ticketType.name = item.TYPE_NAME;

                return callback(res, error, voucher);
            }

            return callback(res, error, results);
        });
    }

    public ListEventsByCity = (cityId: number, res: Response, callback) => {
        
        let query =  "SELECT E.*, EP.IMAGE_URL" + 
                     " FROM EVENTS E" + 
                     " LEFT OUTER JOIN EVENT_PHOTOS EP on E.ID = EP.EVENT_ID" + 
                     " INNER JOIN OWNER O ON E.OWNER_ID = O.ID" + 
                     " WHERE O.ONDE_IR_CITY =  " + cityId + 
                     " GROUP BY E.ID";
        
        DbConnection.connectionPool.query(query, (error, results) => {
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

    public GetEvent = (id: number, res: Response, callback) => {

        let query =  this.listEventsQuery + " WHERE E.ID =  " + id;
        let event: EventEntity = EventEntity.GetInstance();

        DbConnection.connectionPool.query(query, (error, results) => {
            if (!error) {
                event.fromMySqlDbEntity(results[0]);

                this.Sectors.ListFilteredItems(["EVENT_ID"],[event.id.toString()], res, (res, err, results) => {
                    if(!err) {
                        event.sectors = results;
                        
                        this.EventPhotos.ListFilteredItems(["EVENT_ID"],[event.id.toString()], res, (res, err, results) => {
                            if(!err) {
                                event.photos = results;
                            }

                            return callback(res, error, event);
                        });

                    } else {
                        return callback(res, error, event);
                    }
                });

            } else {
                return callback(res, error, results);
            }
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

    public GetSector = (id: number, res: Response, callback) => {

        let sector: SectorEntity = SectorEntity.GetInstance();

        this.Sectors.GetItem([id.toString()], res, (res, error, results) => {
            if (!error && results) {
                sector = results;

                this.TicketTypes.ListFilteredItems(["SECTOR_ID"],[sector.id + ""], res, (res, err, results) => {
                    if(!err) {
                        sector.ticketTypes = results;
                        return callback(res, error, sector);
                    } else {
                        return callback(res, error, results);
                    }
                });

            } else {
                return callback(res, error, results);
            }
        });
    }

    /**
     * List all tickets of sectors in database
    */
    public ListTicketsTypeBySector = (sectorId: number, res: Response, callback) => {

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

    public ListTicketsTypeByEvent = (eventId: number, res: Response, callback) => {

        let query: string = "SELECT TT.*, (AMOUNT - SOLD) AS AVAILABLE, S.NAME AS SECTOR_NAME FROM TICKETS_TYPE AS TT INNER JOIN SECTOR S ON TT.SECTOR_ID = S.ID WHERE S.EVENT_ID = ?";

        DbConnection.connectionPool.query(query, eventId, (error, results) => {
            if (!error) {
                let list: Array<TicketTypeEntity>;
                list = results.map(item => {
                    let typeItem = new TicketTypeEntity();
                    typeItem.fromMySqlDbEntity(item);

                    return typeItem;
                });

                return callback(res, error, list);
            }

            return callback(res, error, results);
        });
    }

    public ListTicketsTypeIn = (ids: string, res: Response, callback) => {

        let query: string = this.listBySectorQuery + "WHERE ID IN (" + ids + ")";

        DbConnection.connectionPool.query(query, (error, results) => {
            if (!error) {
                let list: Array<TicketTypeEntity>;
                list = results.map(item => {
                    let typeItem = new TicketTypeEntity();
                    typeItem.fromMySqlDbEntity(item);

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
    public GetAnnouncementEvent = (id: number, res: Response, callback) => {

        let query =  this.listEventsQuery + " WHERE E.ID =  " + id;
        let event: EventEntity = EventEntity.GetInstance();

        DbConnection.connectionPool.query(query, (error, results) => {
            if (!error) {
                event.fromMySqlDbEntity(results[0]);

                this.Sectors.ListFilteredItems(["EVENT_ID"],[event.id + ""], res, (res, err, results) => {
                    if(!err) {

                        this.GetTypes(results.length, results, res, (res, results) => {
                            event.sectors = results;

                            return callback(res, error, event);
                        });
                    
                    } else {
                        return callback(res, error, results);
                    }
                });

            } else {
                return callback(res, error, results);
            }
        });
    }

    private GetTypes = (count: number, sectors: Array<SectorEntity>, res: Response, callback) => {
        if(count > 0) {

            const sectorId = sectors[count - 1].id + "";

            this.TicketTypes.ListFilteredItems(["SECTOR_ID"],[sectorId], res, (res, err, results) => {
                sectors[count - 1].ticketTypes = results;

                this.GetTypes(count - 1, sectors, res, callback);
            });

        } else {
            return callback(res, sectors);
        }
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
    public SoldTicketType = (action: number, amount: number, sectorId: number, typeId: number, res: Response, callback) => {

        let query: string = action == 1 ? this.updateSoldTicketType : this.cancelSoldTicketType;

        DbConnection.connectionPool.query(query, [amount,sectorId,typeId], (error, results) => {

            return callback(res, error, results);
        });
    }

    public ClearEventPhotos = (id: number, callback) => {
        DbConnection.connectionPool.query(this.clearEventPhotosQuery, [id], (err, result) => {
            return callback(err, result);
        });
    }

    /**
     * List all events and sales by owner
     * 
    */
    public ListEventsSales = (ownerId: number, res: Response, callback) => {

        let query = "SELECT E.ID, E.NAME, IFNULL(SUM(TT.AMOUNT),0) AS TOTAL_AMOUNT, IFNULL(SUM(TT.SOLD),0) AS TOTAL_SOLD " +
                    "FROM EVENTS E " +
                    "LEFT JOIN SECTOR S ON E.ID = S.EVENT_ID " + 
                    "LEFT JOIN TICKETS_TYPE TT ON S.ID = TT.SECTOR_ID " +
                    "WHERE E.OWNER_ID = " + ownerId + " " +
                    "GROUP BY E.ID;";

        DbConnection.connectionPool.query(query, (error, results) => {
            if (!error && results.length > 0) {
                let list: Array<EventSalesEntity>;
                list = results.map(item => {
                    let typeItem = new EventSalesEntity();
                    typeItem.fromMySqlDbEntity(item);

                    return typeItem;
                });

                return callback(res, error, list);
            }

            return callback(res, error, results);
        });
    }

    /**
     * List events sales details
     * 
    */
    public ListEventsSalesDetail = (eventId: number, res: Response, callback) => {

        let query = "SELECT U.ID AS USER_ID, U.NAME AS USER_NAME, B.DOCUMENT, TS.DATE, SUM(V.VALUE) AS TOTAL, COUNT(V.ID) AS AMOUNT, TS.ID AS TICKET_SALE_ID, TS.TRANSACTION_ID " +
                    "FROM USERS U " +
                    "INNER JOIN BUYER_INFO B ON U.ID = B.USER_ID " +
                    "INNER JOIN VOUCHERS V ON B.USER_ID = V.USER_ID " +
                    "INNER JOIN TICKET_SALES TS ON V.TICKET_SALE_ID = TS.ID " +
                    "INNER JOIN TICKETS_TYPE TT ON V.TICKET_TYPE_ID = TT.ID " +
                    "INNER JOIN SECTOR S ON TT.SECTOR_ID = S.ID " +
                    "WHERE S.EVENT_ID = " + eventId + " " +
                    "GROUP BY U.ID, B.DOCUMENT, TS.ID " +
                    "ORDER BY TS.DATE DESC;";

        DbConnection.connectionPool.query(query, (error, results) => {
            if (!error && results.length > 0) {
                let list: Array<EventSalesDetailEntity>;
                list = results.map(item => {
                    let typeItem = new EventSalesDetailEntity();
                    typeItem.fromMySqlDbEntity(item);

                    return typeItem;
                });

                return callback(res, error, list);
            }

            return callback(res, error, results);
        });
    }

    /**
     * List events sales tickets
     * 
    */
    public ListEventsSalesTicket = (action: number, id: number, res: Response, callback) => {

        let query = "";

        // Novo
        if(action == 1) {
            query = "SELECT S.NAME AS SECTOR_NAME, TT.NAME AS TICKET_TYPE_NAME, TT.ID AS TICKET_TYPE_ID, (TT.AMOUNT - TT.SOLD) AS AVALIABLE, 0 AS AMOUNT, TT.TOTAL AS VALUE, 0 AS TOTAL  " +
                    "FROM TICKETS_TYPE TT " +
                    "INNER JOIN SECTOR S ON TT.SECTOR_ID = S.ID " +
                    "WHERE S.EVENT_ID = " + id + " " +
                    "GROUP BY TT.ID ORDER BY S.NAME, TT.NAME;";
        
        // Alteração
        } else {
            query = "SELECT S.NAME AS SECTOR_NAME, TT.NAME AS TICKET_TYPE_NAME, TT.ID AS TICKET_TYPE_ID, 0 AS AVALIABLE, COUNT(V.ID) AS AMOUNT, V.VALUE, SUM(V.VALUE) AS TOTAL " +
                    "FROM TICKET_SALES TS " +
                    "INNER JOIN VOUCHERS V ON TS.ID = V.TICKET_SALE_ID " +
                    "INNER JOIN TICKETS_TYPE TT ON V.TICKET_TYPE_ID = TT.ID " +
                    "INNER JOIN SECTOR S ON TT.SECTOR_ID = S.ID " +
                    "WHERE TS.ID = " + id + " " +
                    "GROUP BY TT.ID ORDER BY S.NAME, TT.NAME;";
        }

        DbConnection.connectionPool.query(query, (error, results) => {
            if (!error && results.length > 0) {
                let list: Array<EventSalesTicketEntity>;
                list = results.map(item => {
                    let typeItem = new EventSalesTicketEntity();
                    typeItem.fromMySqlDbEntity(item);

                    return typeItem;
                });

                return callback(res, error, list);
            }

            return callback(res, error, results);
        });
    }

    /**
     * Get sumary event sales in database
    */
    public GetEventSaleSummary = (id: number, res: Response, callback) => {

        let query = "SELECT IFNULL(SUM(TS.AMOUNT),0) AS AMOUNT, IFNULL(SUM(TS.TOTAL),0) AS TOTAL, IFNULL(SUM(TS.TOTAL_TAX),0) AS TOTAL_TAX FROM TICKET_SALES TS WHERE TS.STATUS = 1 AND TS.EVENT_ID = ?";

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
     * Get Buyer Info
     * 
    */
    public GetBuyerInfo = (userId: number, res: Response, callback) => {

        let query = "SELECT U.ID as USER_ID, U.NAME, U.E_MAIL, B.DOCUMENT, B.ADDRESS, B.ZIP_CODE " +
                    "FROM BUYER_INFO B INNER JOIN USERS U ON B.USER_ID = U.ID " +
                    "WHERE B.USER_ID = " + userId;

        DbConnection.connectionPool.query(query, (error, results) => {
            if (!error && results.length > 0) {
                let saleItem = new BuyerInfoEntity();
                saleItem.fromMySqlDbEntity(results[0]);

                return callback(res, error, saleItem);
            }

            return callback(res, error, results);
        });
    }

    /**
     * Execute Procedure to cancel sale
     * 
    */
    public CancelTicketSale = (ticketSaleId: number, res: Response, callback) => {

        let query: string = "CALL CANCEL_TICKET_SALES(?)";

        DbConnection.connectionPool.query(query, ticketSaleId, (error, results) => {
            return callback(res, error, results);
        });
    }
}