import { BaseEntity } from '../base/base.model';
import { BuyerInfoEntity } from './buyerInfo.model';
import { CardTransactionEntity } from './cardTransaction.model';
import { VoucherEntity } from './voucher.model';

export class TicketSaleEntity extends BaseEntity {
    public id: number = 0;
    public buyerInfoId: number = 0;
    public eventId: number = 0;
    public transactionId: number = 0;
    public date: Date = new Date();
    public total: number = 0;
    public amount: number = 0;
    public totalTax: number = 0;
    
    public buyerInfo: BuyerInfoEntity = new BuyerInfoEntity();
    public cardTransaction: CardTransactionEntity = new CardTransactionEntity();
    public vouchers: Array<VoucherEntity> = Array<VoucherEntity>();

    public static GetInstance(): TicketSaleEntity {
        const instance: TicketSaleEntity = new TicketSaleEntity();
        instance.buyerInfo = new BuyerInfoEntity();
        instance.cardTransaction = new CardTransactionEntity();
        instance.vouchers = new Array<VoucherEntity>();

        return instance;
    }

    toMysqlDbEntity(isNew) {
        if (isNew) {
            return {
                BUYER_INFO_ID: this.buyerInfoId,
                TRANSACTION_ID: this.transactionId,
                EVENT_ID: this.eventId,
                DATE: this.date,
                TOTAL: this.total,
                TOTAL_TAX: this.totalTax,
                AMOUNT: this.amount
            }
        } else {
            return {
                ID: this.id,
                BUYER_INFO_ID: this.buyerInfoId,
                TRANSACTION_ID: this.transactionId,
                EVENT_ID: this.eventId,
                DATE: this.date,
                TOTAL: this.total,
                TOTAL_TAX: this.totalTax,
                AMOUNT: this.amount
            }
        }
    }

    fromMySqlDbEntity(dbEntity) {
        this.id = dbEntity.ID;
        this.buyerInfoId = dbEntity.BUYER_INFO_ID;
        this.transactionId = dbEntity.TRANSACTION_ID;
        this.eventId = dbEntity.EVENT_ID;
        this.date = dbEntity.DATE;
        this.total = dbEntity.TOTAL;
        this.totalTax = dbEntity.TOTAL_TAX;
        this.amount = dbEntity.AMOUNT
    }
}