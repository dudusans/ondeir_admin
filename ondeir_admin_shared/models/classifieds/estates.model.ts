import { MotorAssemblerEntity } from './motorsAssembler.model';
import { ClassifiedEntity } from './classified.model';
import { BaseEntity } from '../base/base.model';

export enum ESalesType {
    Aluguel = 1,
    Venda = 2
}

export enum EEstateType {
    Casa = 1,
    Apartamento = 2,
    Loft = 3,
    Kitnet = 4,
    Studio = 5,
    Flat = 6,
    Cobertura = 7,
    Terreno = 8,
    Rural = 9,
    Comercial = 10
}

export class EstatesEntity extends BaseEntity {
    public classified: ClassifiedEntity;
    public type: EEstateType = EEstateType.Casa;
    public totalArea: number = 0;
    public avaliableArea: number = 0;
    public bedrooms: number = 0;
    public baths: number = 0;
    public masters: number = 0;
    public parking: number = 0;
    public reference: string = "";
    public address: string = "";
    public latitude: string = "";
    public longitude: string = "";
    public salesType: ESalesType = ESalesType.Venda;

    public static GetInstance(): EstatesEntity {
        const instance: EstatesEntity = new EstatesEntity();
        instance.classified = ClassifiedEntity.GetInstance();

        return instance;
    }

    toMysqlDbEntity(isNew) {
        if (isNew) {
            return {
                CLASSIFIED_ID: this.classified.id,
                TYPE: this.type,
                TOTAL_AREA: this.totalArea,
                AVALIABLE_AREA: this.avaliableArea,
                BEDROOMS: this.bedrooms,
                BATHS: this.baths,
                MASTERS: this.masters,
                PARKING: this.parking,
                REFERENCE: this.reference,
                ADDRESS: this.address,
                LATITUDE: this.latitude,
                LONGITUDE: this.longitude,
                SALES_TYPE: this.salesType
            }
        } else {
            return {
                TYPE: this.type,
                TOTAL_AREA: this.totalArea,
                AVALIABLE_AREA: this.avaliableArea,
                BEDROOMS: this.bedrooms,
                BATHS: this.baths,
                MASTERS: this.masters,
                PARKING: this.parking,
                REFERENCE: this.reference,
                ADDRESS: this.address,
                LATITUDE: this.latitude,
                LONGITUDE: this.longitude,
                SALES_TYPE: this.salesType
            }
        }
    }

    fromMySqlDbEntity(dbEntity) {
        this.classified.fromMySqlDbEntity(dbEntity);
        this.type = dbEntity.TYPE;
        this.totalArea = dbEntity.TOTAL_AREA;
        this.avaliableArea = dbEntity.AVALIABLE_AREA;
        this.bedrooms = dbEntity.BEDROOMS;
        this.baths = dbEntity.BATHS;
        this.parking = dbEntity.PARKING;
        this.masters = dbEntity.MASTERS;
        this.reference = dbEntity.REFERENCE;
        this.address = dbEntity.ADDRESS;
        this.latitude = dbEntity.LATITUDE;
        this.longitude = dbEntity.LONGITUDE;
        this.salesType = dbEntity.SALES_TYPE;
    }
}