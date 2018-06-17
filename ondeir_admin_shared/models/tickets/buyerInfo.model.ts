import { BaseEntity } from '../base/base.model';

export class BuyerInfoEntity extends BaseEntity {
    public userId: number = 0;
    public document: string = "";
    
    public static GetInstance(): BuyerInfoEntity {
        const instance: BuyerInfoEntity = new BuyerInfoEntity();

        return instance;
    }

    toMysqlDbEntity(isNew) {
        if (isNew) {
            return {
                USER_ID: this.userId,
                DOCUMENT: this.document
            }
        } else {
            return {
                DOCUMENT: this.document
            }
        }
    }

    fromMySqlDbEntity(dbEntity) {
        this.userId = dbEntity.USER_ID;
        this.document = dbEntity.DOCUMENT;
    }
}