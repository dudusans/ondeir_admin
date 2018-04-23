import { IToMysqlDbEntity } from "./iToMysqlDbEntity";

export abstract class BaseEntity implements IToMysqlDbEntity {
    
    
    toMysqlDbEntity(isNew: boolean) {
        
    }
    fromMySqlDbEntity(dbentity: any) {
        
    }
    public Map(objData: any) {
        Object.assign(this, objData);
    }
}