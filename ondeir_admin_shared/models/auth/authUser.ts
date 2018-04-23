import { BaseEntity } from '../base/base.model';

export class AuthUserEntity extends BaseEntity {
    public user: string;
    public password: string;
}