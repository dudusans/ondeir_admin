import { BaseEntity } from '../base/base.model';

export class EventPhotoEntity extends BaseEntity {
    public id: number = 0;
    public eventId: number = 0;
    public image: string = "";

    public static GetInstance(): EventPhotoEntity {
        const instance: EventPhotoEntity = new EventPhotoEntity();

        return instance;
    }

    toMysqlDbEntity(isNew) {
        if (isNew) {
            return {
                EVENT_ID: this.eventId,
                IMAGE_URL: this.image
            }
        } else {
            return {
                EVENT_ID: this.eventId,
                IMAGE_URL: this.image
            }
        }
    }

    fromMySqlDbEntity(dbEntity) {
        this.id = dbEntity.ID;
        this.eventId = dbEntity.EVENT_ID;
        this.image = dbEntity.IMAGE_URL;
    }
}