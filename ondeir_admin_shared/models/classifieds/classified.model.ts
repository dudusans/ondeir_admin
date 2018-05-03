import { BaseEntity } from '../base/base.model';

export enum EStoreType {
    Undefined = 0,
    Auto = 1,
    Estates = 2
}

export class ClassifiedEntity extends BaseEntity {
    public id: number = 0;
    public ownerId: number = 0;
    public title: string = "";
    public description: string = "";
    public cost: number = 0;
    public featured: boolean = false;
    public active: boolean = false;

    public static GetInstance(): ClassifiedEntity {
        const instance: ClassifiedEntity = new ClassifiedEntity();

        return instance;
    }

    toMysqlDbEntity(isNew) {
        if (isNew) {
            return {
                OWNER_ID: this.ownerId,
                TITLE: this.title,
                COST: this.cost,
                DESCRIPTION: this.description,
                FEATURED: this.featured ? 1 : 0,
                ACTIVE: this.active ? 1 : 0
            }
        } else {
            return {
                OWNER_ID: this.ownerId,
                TITLE: this.title,
                COST: this.cost,
                DESCRIPTION: this.description,
                FEATURED: this.featured ? 1 : 0,
                ACTIVE: this.active ? 1 : 0
            }
        }
    }

    fromMySqlDbEntity(dbEntity) {
        this.ownerId = dbEntity.OWNER_ID;
        this.id = dbEntity.ID;
        this.title = dbEntity.TITLE;
        this.cost = dbEntity.COST;
        this.description = dbEntity.DESCRIPTION;
        this.featured = dbEntity.FEATURED === 1 ? true : false;
        this.active = dbEntity.ACTIVE === 1 ? true : false;
    }
}