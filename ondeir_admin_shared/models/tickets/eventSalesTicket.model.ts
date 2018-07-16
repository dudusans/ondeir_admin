import { BaseEntity } from '../base/base.model';

export class EventSalesTicketEntity extends BaseEntity {
    public sectorName: string = "";
    public ticketTypeName: string = "";
    public amount: number = 0;

    public static GetInstance(): EventSalesTicketEntity {
        const instance: EventSalesTicketEntity = new EventSalesTicketEntity();
        return instance;
    }

    fromMySqlDbEntity(dbEntity) {
        this.sectorName = dbEntity.SECTOR_NAME;
        this.ticketTypeName = dbEntity.TICKET_TYPE_NAME;
        this.amount = dbEntity.AMOUNT;
    }
}