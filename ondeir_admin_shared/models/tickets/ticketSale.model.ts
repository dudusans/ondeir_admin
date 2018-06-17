import { BaseEntity } from '../base/base.model';

export class TicketSaleEntity extends BaseEntity {
    public id: number = 0;
    public ticketTypeId: number = 0;
    public date: Date = new Date();
    public number: number = 0;
    public total: number = 0;
    public buyer: number = 0;
    public sectorId: number = 0;
    public document: string = "";
    
    public static GetInstance(): TicketSaleEntity {
        const instance: TicketSaleEntity = new TicketSaleEntity();

        return instance;
    }

    toMysqlDbEntity(isNew) {
        if (isNew) {
            return {
                TICKET_TYPE_ID: this.ticketTypeId,
                DATE: this.date,
                NUMBER: this.number,
                TOTAL: this.total,
                BUYER: this.buyer
            }
        } else {
            return {
                ID: this.id,
                TICKET_TYPE_ID: this.ticketTypeId,
                DATE: this.date,
                NUMBER: this.number,
                TOTAL: this.total,
                BUYER: this.buyer
            }
        }
    }

    fromMySqlDbEntity(dbEntity) {
        this.id = dbEntity.ID;
        this.ticketTypeId = dbEntity.TICKET_TYPE_ID;
        this.date = dbEntity.DATE;
        this.number = dbEntity.NUMBER;
        this.total = dbEntity.TOTAL;
        this.buyer = dbEntity.BUYER;
        this.sectorId = dbEntity.SECTOR_ID
    }
}