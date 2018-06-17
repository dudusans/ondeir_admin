import { BaseEntity } from '../base/base.model';

export class SectorEntity extends BaseEntity {
    public id: number = 0;
    public eventId: number = 0;
    public name: string = "";
    
    public static GetInstance(): SectorEntity {
        const instance: SectorEntity = new SectorEntity();

        return instance;
    }

    toMysqlDbEntity(isNew) {
        if (isNew) {
            return {
                EVENT_ID: this.eventId,
                NAME: this.name
            }
        } else {
            return {
                NAME: this.name
            }
        }
    }

    fromMySqlDbEntity(dbEntity) {
        this.id = dbEntity.ID;
        this.eventId = dbEntity.EVENT_ID;
        this.name = dbEntity.NAME;
    }
}