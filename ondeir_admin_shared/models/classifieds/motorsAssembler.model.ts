import { BaseEntity } from '../base/base.model';

export class MotorAssemblerEntity extends BaseEntity {
    public id: number = 0;
    public name: string = "";
    public logo: string = "";

    public static GetInstance(): MotorAssemblerEntity {
        const instance: MotorAssemblerEntity = new MotorAssemblerEntity();

        return instance;
    }

    fromMySqlDbEntity(dbEntity) {
        this.id = dbEntity.ID;
        this.name = dbEntity.NAME;
        this.logo = dbEntity.LOGO;
    }
}