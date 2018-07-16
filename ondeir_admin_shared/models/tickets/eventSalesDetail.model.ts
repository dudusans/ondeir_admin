import { BaseEntity } from '../base/base.model';

export class EventSalesDetailEntity extends BaseEntity {
    public userId: number = 0;
    public ticketSaleId: number = 0;
    public transactionId: number = 0;
    public name: string = "";
    public document: string = "";
    public date: Date = new Date();
    public total: number = 0;
    public amount: number = 0;

    public static GetInstance(): EventSalesDetailEntity {
        const instance: EventSalesDetailEntity = new EventSalesDetailEntity();
        return instance;
    }

    fromMySqlDbEntity(dbEntity) {
        this.userId = dbEntity.USER_ID;
        this.name = dbEntity.USER_NAME;
        this.document = dbEntity.DOCUMENT;
        this.amount = dbEntity.AMOUNT;
        this.total = dbEntity.TOTAL;
        this.transactionId = dbEntity.TRANSACTION_ID;
        this.ticketSaleId = dbEntity.TICKET_SALE_ID;
        this.date = dbEntity.DATE;
    }
}