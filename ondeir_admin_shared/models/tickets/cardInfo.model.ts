import { BaseEntity } from '../base/base.model';

export class CardInfoEntity extends BaseEntity {
    public cardNumber: string = "";
    public cardName: string = "";
    public valid: string = "";
    public cvv: string = "";
    public birthDate: string = "";

    public static GetInstance(): CardInfoEntity {
        const instance: CardInfoEntity = new CardInfoEntity();

        return instance;
    }

    toMysqlDbEntity(isNew) {
        
    }

    fromMySqlDbEntity(dbEntity) {
        
    }
}