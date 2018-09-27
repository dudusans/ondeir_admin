import { BaseEntity } from '../base/base.model';

export class BuyerInfoEntity extends BaseEntity {
    public userId: number = 0;
    public document: string = "";
    public address: string = "";
    public number: string = "";
    public district: string = "";
    public city: string = "";
    public state: string = "";
    public zipCode: string = "";

    public name: string = "";
    public email: string = "";

    public static GetInstance(): BuyerInfoEntity {
        const instance: BuyerInfoEntity = new BuyerInfoEntity();
        
        return instance;
    }

    toMysqlDbEntity(isNew) {
        if (isNew) {
            return {
                USER_ID: this.userId,
                DOCUMENT: this.document,
                ADDRESS: this.address,
                CITY: this.city,
                ZIP_CODE: this.zipCode
            }
        } else {
            return {
                DOCUMENT: this.document,
                ADDRESS: this.address,
                CITY: this.city,
                ZIP_CODE: this.zipCode
            }
        }
    }

    fromMySqlDbEntity(dbEntity) {
        this.userId = dbEntity.USER_ID;
        this.document = dbEntity.DOCUMENT;
        this.address = dbEntity.ADDRESS;
        this.city = dbEntity.CITY;
        this.zipCode = dbEntity.ZIP_CODE;
        this.name = dbEntity.NAME;
        this.email = dbEntity.E_MAIL;
    }
}