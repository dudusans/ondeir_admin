import { OffersEntity } from './offers.model';
import { BaseEntity } from '../base/base.model';
import { IToMysqlDbEntity } from '../base/iToMysqlDbEntity';

export class CouponEntity extends BaseEntity {
    public id: number = 0;
    public offerId: number = 0;
    public userId: number = 0;
    public couponLink: string = "";
    public isValid: boolean = false;
    public offer?: OffersEntity;

    public static GetInstance(): CouponEntity {
        const instance: CouponEntity = new CouponEntity();
        instance.offer = OffersEntity.getInstance();
        
        return instance;
    }

    toMysqlDbEntity(isNew: boolean) {
        if (isNew) {
            return {
                OFFER_ID: this.offerId,
                USER_ID: this.userId,
                COUPON_LINK: this.couponLink,
                IS_VALID: this.isValid ? 1 : 0
            }
        } else {
            return {
                COUPON_LINK: this.couponLink,
                IS_VALID: this.isValid ? 1 : 0
            }
        }
    }
    fromMySqlDbEntity(dbentity: any) {
        this.id = dbentity.ID;
        this.offerId = dbentity.OFFER_ID;
        this.userId = dbentity.USER_ID;
        this.couponLink = dbentity.COUPON_LINK;
        this.isValid = dbentity.IS_VALID;   
    }
}