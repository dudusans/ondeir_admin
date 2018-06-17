import { BaseEntity } from '../base/base.model';

export class CardTransactionEntity extends BaseEntity {
    public saleId: number = 0;
    public identifier: string = "";
    public dateTime: Date = new Date();
    
    public static GetInstance(): CardTransactionEntity {
        const instance: CardTransactionEntity = new CardTransactionEntity();

        return instance;
    }

    toMysqlDbEntity(isNew) {
        if (isNew) {
            return {
                SALE_ID: this.saleId,
                IDENTIFIER: this.identifier,
                DATE_TIME: this.dateTime
            }
        } else {
            return {
                IDENTIFIER: this.identifier,
                DATE_TIME: this.dateTime
            }
        }
    }

    fromMySqlDbEntity(dbEntity) {
        this.saleId = dbEntity.SALE_ID;
        this.identifier = dbEntity.IDENTIFIER;
        this.dateTime = dbEntity.DATE_TIME;
    }
}