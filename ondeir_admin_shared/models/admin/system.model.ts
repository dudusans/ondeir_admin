import { BaseEntity } from '../base/base.model';

export class SystemEntity extends BaseEntity {
    
    public id: number = 0;
    public parentId?: number = undefined;
    public name: string = "";    
    public logo: string = "";
    public menuLink: string = "";
    public menuTitle: string = "";
    public menuLogo: string = "";
    public menuOrder: number = 9999;
    public children: Array<SystemEntity>;

    public static GetInstance(): SystemEntity {
        const instance: SystemEntity = new SystemEntity();
        instance.children = new Array<SystemEntity>();

        return instance;
    }

    toMysqlDbEntity(isNew: boolean) {
        if (isNew) {
            return {
                NAME: this.name,                
                LOGO: this.logo,
                MENU_TITLE: this.menuTitle,
                MENU_LINK: this.menuLink,
                MENU_LOGO: this.menuLogo,
                MENU_ORDER: this.menuOrder
            }
        } else {
            return {
                NAME: this.name,                
                LOGO: this.logo,
                MENU_TITLE: this.menuTitle,
                MENU_LINK: this.menuLink,
                MENU_LOGO: this.menuLogo,
                MENU_ORDER: this.menuOrder
                
            }
        }
    }
    fromMySqlDbEntity(dbentity: any) {
        this.id = dbentity.ID;
        this.name = dbentity.NAME;
        //this.parentId = dbentity.PARENT_ID;
        this.logo = dbentity.LOGO;
        this.menuLink = dbentity.MENU_LINK;
        this.menuTitle = dbentity.MENU_TITLE;
        this.menuLogo = dbentity.MENU_LOGO;    
        this.menuOrder = dbentity.MENU_ORDER;    
    }
}