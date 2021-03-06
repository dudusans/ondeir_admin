import { BaseEntity } from '../base/base.model';
import { TicketTypeEntity } from './ticketType.model';

export class SectorEntity extends BaseEntity {
    public id: number = 0;
    public eventId: number = 0;
    public name: string = "";

    public ticketTypes: Array<TicketTypeEntity> = Array<TicketTypeEntity>();
    
    public static GetInstance(): SectorEntity {
        const instance: SectorEntity = new SectorEntity();
        instance.ticketTypes = Array<TicketTypeEntity>();

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
                EVENT_ID: this.eventId,
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