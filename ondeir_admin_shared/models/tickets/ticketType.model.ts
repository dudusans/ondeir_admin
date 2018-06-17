import { BaseEntity } from '../base/base.model';

export class TicketTypeEntity extends BaseEntity {
    public id: number = 0;
    public sectorId: number = 0;
    public name: string = "";
    public value: number = 0;
    public tax: number = 0;
    public total: number = 0;
    public amount: number = 0;
    public sold: number = 0;
    public available: number = 0;
    
    public static GetInstance(): TicketTypeEntity {
        const instance: TicketTypeEntity = new TicketTypeEntity();

        return instance;
    }

    toMysqlDbEntity(isNew) {
        if (isNew) {
            return {
                SECTOR_ID: this.sectorId,
                NAME: this.name,
                VALUE: this.value,
                TAX: this.tax,
                TOTAL: this.total,
                AMOUNT: this.amount,
                SOLD: this.sold
            }
        } else {
            return {
                NAME: this.name,
                VALUE: this.value,
                TAX: this.tax,
                TOTAL: this.total,
                AMOUNT: this.amount,
                SOLD: this.sold
            }
        }
    }

    fromMySqlDbEntity(dbEntity) {
        this.id = dbEntity.ID;
        this.sectorId = dbEntity.SECTOR_ID;
        this.name = dbEntity.NAME;
        this.value = dbEntity.VALUE;
        this.tax = dbEntity.TAX;
        this.total = dbEntity.TOTAL;
        this.amount = dbEntity.AMOUNT;
        this.sold = dbEntity.SOLD;
        this.available = dbEntity.AVAILABLE;
    }
}