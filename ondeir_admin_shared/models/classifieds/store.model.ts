import { BaseEntity } from '../base/base.model';

export enum EStoreType {
    Auto = 1,
    Estates = 2
}

export class StoreEntity extends BaseEntity {
    public ownerId: number = 0;
    public logo: string = "";
    public header: string = "";
    public description: string = "";
    public type: EStoreType;
    public active: boolean = true;

    public static GetInstance(): StoreEntity {
        const instance: StoreEntity = new StoreEntity();

        return instance;
    }

    toMysqlDbEntity(isNew) {
        if (isNew) {
            return {
                OWNER_ID: this.ownerId,
                STORE_LOGO: this.logo,
                STORE_HEADER: this.header,
                DESCRIPTION: this.description,
                TYPE: this.type,
                STATUS: this.active ? 1 : 0
            }
        } else {
            return {
                STORE_LOGO: this.logo,
                STORE_HEADER: this.header,
                DESCRIPTION: this.description,
                TYPE: this.type,
                STATUS: this.active ? 1 : 0
            }
        }
    }

    fromMySqlDbEntity(dbEntity) {
        this.ownerId = dbEntity.OWNER_ID;
        this.logo = dbEntity.STORE_LOGO;
        this.header = dbEntity.STORE_HEADER;
        this.description = dbEntity.DESCRIPTION;
        this.type = dbEntity.TYPE;
        this.active = dbEntity.STATUS === 1 ? true : false;
    }
}