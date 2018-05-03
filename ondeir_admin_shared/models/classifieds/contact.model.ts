import { BaseEntity } from '../base/base.model';


export class ContactEntity extends BaseEntity {
    public id: number = 0;
    public classifiedId: number = 0;
    public name: string = "";
    public email: string = "";
    public cellphone: string = "";
    public message: string = "";
    public contactDate: Date = new Date();

    

    public static GetInstance(): ContactEntity {
        const instance: ContactEntity = new ContactEntity();

        return instance;
    }

    toMysqlDbEntity(isNew) {
        if (isNew) {
            return {
                CLASSIFIED_ID: this.classifiedId,
                NAME: this.name,
                EMAIL: this.email,
                CELLPHONE: this.cellphone,
                MESSAGE: this.message, 
                CONTACT_DATE: this.contactDate
            }
        } else {
            return {
                ID: this.id, 
                CLASSIFIED_ID: this.classifiedId,
                NAME: this.name,
                EMAIL: this.email,
                CELLPHONE: this.cellphone,
                MESSAGE: this.message, 
            }
        }
    }

    fromMySqlDbEntity(dbEntity) {
        this.id = dbEntity.ID;
        this.classifiedId = dbEntity.CLASSIFIED_ID;
        this.name = dbEntity.NAME;
        this.email = dbEntity.EMAIL;
        this.cellphone = dbEntity.CELLPHONE;
        this.message = dbEntity.MESSAGE;
        this.contactDate = dbEntity.CONTACT_DATE;
    }
}