import { MotorAssemblerEntity } from './motorsAssembler.model';
import { ClassifiedEntity } from './classified.model';
import { BaseEntity } from '../base/base.model';

export enum EGearType {
    manual = 1,
    auto = 2
}

export enum EGasType {
    gasoline = 1,
    alchool = 2,
    diesel = 3,
    flex = 4,
    gases = 5
}

export enum EModelType {
    hatch = 1,
    sedan = 2,
    pickup = 3,
    truck = 4,
    motorcicle = 5,
    conversable = 6,
    mini = 7,
    coupe = 8,
    wagon = 9
}

export class MotorsEntity extends BaseEntity {
    public classified: ClassifiedEntity;
    public assemblerId: number = 0;     
    public year: number = new Date().getFullYear();
    public color: string = "";
    public gear: EGearType = EGearType.manual;
    public gasType: EGasType = EGasType.flex;
    public kilometers: number = 0;
    public model: EModelType = EModelType.hatch;
    public label: string = "";
    public plateNumber: number = 0;
    public assembler?: MotorAssemblerEntity;

    public static GetInstance(): MotorsEntity {
        const instance: MotorsEntity = new MotorsEntity();
        instance.classified = ClassifiedEntity.GetInstance();
        instance.assembler = MotorAssemblerEntity.GetInstance();

        return instance;
    }

    toMysqlDbEntity(isNew) {
        if (isNew) {
            return {
                CLASSIFIED_ID: this.classified.id,
                YEAR: this.year,
                COLOR: this.color,
                GAS_TYPE: this.gasType,
                MODEL: this.model,
                QUILOMETERS: this.kilometers,
                LABEL: this.label,
                PLATE_NUMBER: this.plateNumber,
                ASSEMBLER_ID: this.assemblerId
            }
        } else {
            return {
                YEAR: this.year,
                COLOR: this.color,
                GAS_TYPE: this.gasType,
                MODEL: this.model,
                QUILOMETERS: this.kilometers,
                LABEL: this.label,
                PLATE_NUMBER: this.plateNumber,
                ASSEMBLER_ID: this.assemblerId
            }
        }
    }

    fromMySqlDbEntity(dbEntity) {
        this.classified.fromMySqlDbEntity(dbEntity);
        this.assemblerId = dbEntity.ASSEMBLER_ID;
        this.year = dbEntity.YEAR;
        this.color = dbEntity.COLOR;
        this.gear = dbEntity.GEAR;
        this.gasType = dbEntity.GAS_TYPE;
        this.model = dbEntity.MODEL;
        this.kilometers = dbEntity.QUILOMETERS;
        this.label = dbEntity.LABEL;
        this.plateNumber = dbEntity.PLATE_NUMBER;
        this.assembler = MotorAssemblerEntity.GetInstance();
        this.assembler.id = dbEntity.ASSEMBLER_ID;
        this.assembler.name = dbEntity.NAME;
        this.assembler.logo = dbEntity.LOGO;
    }
}