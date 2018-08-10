import { BaseEntity } from '../base/base.model';
import { SectorEntity } from './sector.model';
import { EventPhotoEntity } from './eventPhotos.model';

export class EventEntity extends BaseEntity {
    public id: number = 0;
    public ownerId: number = 0;
    public name: string = "";
    public date: Date = new Date();
    public timeBegin: String = "";
    public timeEnd: String = "";
    public location: string = "";
    public latitude: string = "";
    public longitude: string = "";
    public description: string = "";
    public classification: string = "";
    public facebook: string = "";
    public instagram: string = "";
    public website: string = "";
    public warnings: string = "";
    public featuredImage: string = "";

    public sectors: Array<SectorEntity> = Array<SectorEntity>();
    public photos: Array<EventPhotoEntity> = Array<EventPhotoEntity>();
    
    public static GetInstance(): EventEntity {
        const instance: EventEntity = new EventEntity();
        instance.sectors = Array<SectorEntity>();
        instance.photos = Array<EventPhotoEntity>();

        return instance;
    }

    toMysqlDbEntity(isNew) {
        if (isNew) {
            return {
                OWNER_ID: this.ownerId,
                NAME: this.name,
                DATE: this.date,
                TIME_BEGIN: this.timeBegin,
                TIME_END: this.timeEnd,
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
                DATE: this.date,
                TIME_BEGIN: this.timeBegin,
                TIME_END: this.timeEnd,
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
        this.date = dbEntity.DATE;
        this.timeBegin = dbEntity.TIME_BEGIN;
        this.timeEnd = dbEntity.TIME_END;
        this.location = dbEntity.LOCATION;
        this.latitude = dbEntity.LATITUDE;
        this.longitude = dbEntity.LONGITUDE;
        this.description = dbEntity.DESCRIPTION;
        this.classification = dbEntity.CLASSIFICATION;
        this.facebook = dbEntity.FACEBOOK;
        this.instagram = dbEntity.INSTAGRAM;
        this.website = dbEntity.WEBSITE;
        this.warnings = dbEntity.WARNINGS;
        this.featuredImage = dbEntity.IMAGE_URL;
    }
}