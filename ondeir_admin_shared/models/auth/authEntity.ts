import { BaseEntity } from '../base/base.model';

export class AuthEntity extends BaseEntity {
    public loginAccept: boolean = false;
    public userName: string = "";
    public authenticationToken: string = "";
    public userId: number = 0;
    public type: number = 1;
}