import { BaseEntity } from '../base/base.model';

export class EventEntity extends BaseEntity {
    public id: number = 0;
    public ownerId: number = 0;
    public name: string = "";
    public dateTime: Date = new Date();
    public location: string = "";
    public latitude: string = "";
    public longitude: string = "";
    public description: string = "";
    public classification: string = "";
    public facebook: string = "";
    public instagram: string = "";
    public website: string = "";
    public warnings: string = "";

    public static GetInstance(): EventEntity {
        const instance: EventEntity = new EventEntity();

        return instance;
    }

    toMysqlDbEntity(isNew) {
        if (isNew) {
            return {
                OWNER_ID: this.ownerId,
                NAME: this.name,
                DATE_AND_HOUR: this.dateTime,
                LOCATION: this.location,
                LATITUDE: this.latitude,
                LONGITUDE: this.longitude,
                DESCRIPTION: this.description,
                CLASSIFICATION: this.classification,
                FACEBOOK: this.facebook,
                INSTAGRAM: this.instagram,
                WEBSITE: this.website,
                WARNINGS: this.warnings
            }
        } else {
            return {
                NAME: this.name,
                DATE_AND_HOUR: this.dateTime,
                LOCATION: this.location,
                LATITUDE: this.latitude,
                LONGITUDE: this.longitude,
                DESCRIPTION: this.description,
                CLASSIFICATION: this.classification,
                FACEBOOK: this.facebook,
                INSTAGRAM: this.instagram,
                WEBSITE: this.website,
                WARNINGS: this.warnings
            }
        }
    }

    fromMySqlDbEntity(dbEntity) {
        this.id = dbEntity.ID;
        this.ownerId = dbEntity.OWNER_ID;
        this.name = dbEntity.NAME;
        this.dateTime = dbEntity.DATE_AND_HOUR;
        this.location = dbEntity.LOCATION;
        this.latitude = dbEntity.LATITUDE;
        this.longitude = dbEntity.LONGITUDE;
        this.description = dbEntity.DESCRIPTION;
        this.classification = dbEntity.CLASSIFICATION;
        this.facebook = dbEntity.FACEBOOK;
        this.instagram = dbEntity.INSTAGRAM;
        this.website = dbEntity.WEBSITE;
        this.warnings = dbEntity.WARNINGS;
    }
}