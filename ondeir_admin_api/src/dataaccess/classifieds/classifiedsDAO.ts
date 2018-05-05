import { BaseDAO } from '../baseDAO';
import { CrudDAO } from '../crudDAO';

import { StoreEntity } from '../../../../ondeir_admin_shared/models/classifieds/store.model';
import { ContactEntity } from '../../../../ondeir_admin_shared/models/classifieds/contact.model';
import { ClassifiedEntity } from '../../../../ondeir_admin_shared/models/classifieds/classified.model';
import { DbConnection } from '../../config/dbConnection';
import { MotorsEntity } from '../../../../ondeir_admin_shared/models/classifieds/motors.model';
import { MotorAssemblerEntity } from '../../../../ondeir_admin_shared/models/classifieds/motorsAssembler.model';

export class ClassifiedsDAO extends BaseDAO {
    private listStoresQuery: string = `SELECT S.OWNER_ID, O.TITLE, O.OWNER_NAME, S.TYPE, S.STATUS 
                                         FROM STORE S, OWNER O WHERE S.OWNER_ID = O.ID`
    private listOwnerContactsQuery: string = `SELECT C.ID, C.NAME, C.EMAIL, C.CELLPHONE, C.CONTACT_DATE, CF.TITLE
                                                FROM CONTACTS C, CLASSIFIED CF
                                                WHERE C.CLASSIFIED_ID = CF.ID`;
    private getMotorClassifiedQuery: string = `SELECT C.ID, C.TITLE, C.DESCRIPTION, C.COST, C.FEATURED, O.ONDE_IR_ID AS STORE_ID, IMAGE_URL AS PHOTO,
                                                    M.YEAR, M.COLOR, M.GEAR, M.GAS_TYPE, M.MODEL, M.QUILOMETERS, M.LABEL, M.PLATE_NUMBER
                                                FROM CLASSIFIED C LEFT JOIN CLASSIFIED_PHOTOS CP ON C.ID = CP.CLASSIFIED_ID,
                                                OWNER O, MOTORS M, MOTOR_ASSEMBLERS MA 
                                                WHERE C.OWNER_ID = O.ID
                                                AND C.ID = M.CLASSIFIED_ID
                                                AND M.ASSEMBLER_ID = MA.ID
                                                AND C.ID = ?`
    private getEstatesClassifiedQuery: string = `SELECT C.ID, C.TITLE, C.DESCRIPTION, C.COST, C.FEATURED, O.ONDE_IR_ID AS STORE_ID, IMAGE_URL AS PHOTO
                                                FROM CLASSIFIED C LEFT JOIN CLASSIFIED_PHOTOS CP ON C.ID = CP.CLASSIFIED_ID,
                                                    OWNER O 
                                                WHERE C.OWNER_ID = O.ID
                                                  AND C.ID = ?`

    public Stores: CrudDAO<StoreEntity> = new CrudDAO<StoreEntity>(process.env.DB_FIDELIDADE || '', "STORE", ["OWNER_ID"], StoreEntity);
    public Contacts: CrudDAO<ContactEntity> = new CrudDAO<ContactEntity>(process.env.DB_FIDELIDADE || '', "CONTACTS", ["ID"], ContactEntity);
    public Classifieds: CrudDAO<ClassifiedEntity> = new CrudDAO<ClassifiedEntity>(process.env.DB_FIDELIDADE || '', "CLASSIFIED", ["ID"], ClassifiedEntity);
    public Motors: CrudDAO<MotorsEntity> = new CrudDAO<MotorsEntity>(process.env.DB_FIDELIDADE || '', "MOTORS", ["CLASSIFIED_ID"], MotorsEntity);
    public Assemblers: CrudDAO<MotorAssemblerEntity> = new CrudDAO<MotorAssemblerEntity>(process.env.DB_FIDELIDADE || '', "MOTOR_ASSEMBLERS", ["ID"], MotorAssemblerEntity);

    constructor() {
        super();
    }

    public ListStores = (cityId: number, res, callback) => {
        let query = this.listStoresQuery;
        if (cityId > 0) {
            query += ` AND O.ONDE_IR_CITY = ${cityId}`;
        }

        DbConnection.connectionPool.query(query, (err, result) => {
            return callback(res, err, result);
        });
    }

    public ListOwnerContacts = (ownerId: number, res, callback) => {
        let query = this.listOwnerContactsQuery;
        if (ownerId > 0) {
            query += ` AND CF.OWNER_ID = ? = ${ownerId}`;
        }

        query += ` ORDER BY C.CONTACT_DATE DESC`;

        DbConnection.connectionPool.query(query, (err, result) => {
            return callback(res, err, result);
        });
    }

    public GetMotorClassified = (id: number, res, callback) => {
        DbConnection.connectionPool.query(this.getMotorClassifiedQuery, (err, result) => {
            if (err) {
                return callback(res, err, null);
            }
        });
    }

    public GetEstatesClassified = (id: number, res, callback) => {
        DbConnection.connectionPool.query(this.getEstatesClassifiedQuery, (err, result) => {
            if (err) {
                return callback(res, err, null);
            }
        });
    }
}