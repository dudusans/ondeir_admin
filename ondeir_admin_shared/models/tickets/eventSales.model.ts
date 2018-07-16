import { BaseEntity } from '../base/base.model';

export class EventSalesEntity extends BaseEntity {
    public id: number = 0;
    public name: string = "";
    public totalAmount: number = 0;
    public totalSold: number = 0;

    public static GetInstance(): EventSalesEntity {
        const instance: EventSalesEntity = new EventSalesEntity();
        return instance;
    }

    fromMySqlDbEntity(dbEntity) {
        this.id = dbEntity.ID;
        this.name = dbEntity.NAME;
        this.totalAmount = dbEntity.TOTAL_AMOUNT;
        this.totalSold = dbEntity.TOTAL_SOLD;
    }
}