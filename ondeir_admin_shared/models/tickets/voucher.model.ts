import { BaseEntity } from '../base/base.model';
import { TicketTypeEntity } from './ticketType.model';
import { SectorEntity } from './sector.model';
import { EventEntity } from './event.model';

export class VoucherEntity extends BaseEntity {
    public id: number;
    public ticketSaleId: number = 0;
    public ticketTypeId: number = 0;
    public qrHash: string = "";
    public value: number = 0; 
    public userId: number = 0;
    public amount: number = 0;

    public ticketType: TicketTypeEntity;
    public sector: SectorEntity;
    public event: EventEntity;

    public static GetInstance(): VoucherEntity {
        const instance: VoucherEntity = new VoucherEntity();
        instance.ticketType = new TicketTypeEntity();
        instance.sector = new SectorEntity();
        instance.event = new EventEntity();

        return instance;
    }

    toMysqlDbEntity(isNew) {
        if (isNew) {
            return {
                TICKET_TYPE_ID: this.ticketTypeId,
                TICKET_SALE_ID: this.ticketSaleId,
                QR_HASH: this.qrHash,
                VALUE: this.value,
                USER_ID: this.userId
            }
        } else {
            return {
                ID: this.id,
                TICKET_TYPE_ID: this.ticketTypeId,
                TICKET_SALE_ID: this.ticketSaleId,
                QR_HASH: this.qrHash,
                VALUE: this.value,
                USER_ID: this.userId
            }
        }
    }

    fromMySqlDbEntity(dbEntity) {
        this.id = dbEntity.ID;
        this.ticketTypeId = dbEntity.TICKET_TYPE_ID;
        this.ticketSaleId = dbEntity.TICKET_SALE_ID;
        this.qrHash = dbEntity.QR_HASH;
        this.value = dbEntity.VALUE;
        this.userId = dbEntity.USER_ID;
    }
}