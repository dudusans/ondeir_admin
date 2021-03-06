import { BaseEntity } from '../base/base.model';

export class CardTransactionEntity extends BaseEntity {
    public id: number = 0;
    public identifier: string = "";
    public dateTime: Date = new Date();
    public status: number = 0;
    public total: number = 0;

    public static GetInstance(): CardTransactionEntity {
        const instance: CardTransactionEntity = new CardTransactionEntity();

        return instance;
    }

    toMysqlDbEntity(isNew) {
        if (isNew) {
            return {
                ID: this.id,
                IDENTIFIER: this.identifier,
                DATE_TIME: this.dateTime,
                STATUS: this.status,
                TOTAL: this.total
            }
        } else {
            return {
                IDENTIFIER: this.identifier,
                DATE_TIME: this.dateTime,
                STATUS: this.status,
                TOTAL: this.total
            }
        }
    }

    fromMySqlDbEntity(dbEntity) {
        this.id = dbEntity.ID;
        this.identifier = dbEntity.IDENTIFIER;
        this.dateTime = dbEntity.DATE_TIME;
        this.status = dbEntity.STATUS;
        this.total = dbEntity.TOTAL;
    }
}