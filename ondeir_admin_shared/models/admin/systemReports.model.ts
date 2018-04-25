import { BaseEntity } from '../base/base.model';

export class SystemReportsEntity extends BaseEntity {
    
    public id: number = 0;
    public systemName: string = "";
    public systemId: number = 0;
    public menuLink: string = "";
    public menuTitle: string = "";
    public menuLogo: string = "";

    public static GetInstance(): SystemReportsEntity {
        const instance: SystemReportsEntity = new SystemReportsEntity();

        return instance;
    }

    toMysqlDbEntity(isNew: boolean) {
        if (isNew) {
            return {
                SYSTEM_ID: this.systemId,
                MENU_TITLE: this.menuTitle,
                MENU_LINK: this.menuLink,
                MENU_LOGO: this.menuLogo
            }
        } else {
            return {
                SYSTEM_ID: this.systemId,
                MENU_TITLE: this.menuTitle,
                MENU_LINK: this.menuLink,
                MENU_LOGO: this.menuLogo
                
            }
        }
    }
    fromMySqlDbEntity(dbentity: any) {
        this.id = dbentity.ID;
        this.systemId = dbentity.SYSTEM_ID;
        this.menuLink = dbentity.MENU_LINK;
        this.menuTitle = dbentity.MENU_TITLE;
        this.menuLogo = dbentity.MENU_LOGO; 
        this.systemName = dbentity.NAME;   
    }
}