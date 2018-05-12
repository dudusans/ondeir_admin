import { BaseEntity } from '../base/base.model';

export class ClassifiedPhotoEntity extends BaseEntity {
    public id: number = 0;
    public classifiedId: number = 0;
    public fileName: string = "";
    public image: string = "";

    public static GetInstance(): ClassifiedPhotoEntity {
        const instance: ClassifiedPhotoEntity = new ClassifiedPhotoEntity();

        return instance;
    }

    toMysqlDbEntity(isNew) {
        if (isNew) {
            return {
                CLASSIFIED_ID: this.classifiedId,
                IMAGE_URL: this.image
            }
        } else {
            return {
                CLASSIFIED_ID: this.classifiedId,
                IMAGE_URL: this.image
            }
        }
    }

    fromMySqlDbEntity(dbEntity) {
        this.classifiedId = dbEntity.ID;
        this.id = dbEntity.IMAGE_ID;
        this.image = dbEntity.IMAGE_URL;
    }
}