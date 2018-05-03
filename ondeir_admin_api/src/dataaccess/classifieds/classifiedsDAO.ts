import { BaseDAO } from '../baseDAO';
import { CrudDAO } from '../crudDAO';

import { StoreEntity } from '../../../../ondeir_admin_shared/models/classifieds/store.model';
import { ContactEntity } from '../../../../ondeir_admin_shared/models/classifieds/contact.model';
import { ClassifiedEntity } from '../../../../ondeir_admin_shared/models/classifieds/classified.model';
import { DbConnection } from '../../config/dbConnection';

export class ClassifiedsDAO extends BaseDAO {
    private listStoresQuery: string = `SELECT S.OWNER_ID, O.TITLE, O.OWNER_NAME, S.TYPE, S.STATUS 
                                         FROM STORE S, OWNER O WHERE S.OWNER_ID = O.ID`
    private listOwnerContactsQuery: string = `SELECT C.ID, C.NAME, C.EMAIL, C.CELLPHONE, C.CONTACT_DATE, CF.TITLE
                                                FROM CONTACTS C, CLASSIFIED CF
                                                WHERE C.CLASSIFIED_ID = CF.ID`;

    public Stores: CrudDAO<StoreEntity> = new CrudDAO<StoreEntity>(process.env.DB_FIDELIDADE || '', "STORE", ["OWNER_ID"], StoreEntity);
    public Contacts: CrudDAO<ContactEntity> = new CrudDAO<ContactEntity>(process.env.DB_FIDELIDADE || '', "CONTACTS", ["ID"], ContactEntity);
    public Classifieds: CrudDAO<ClassifiedEntity> = new CrudDAO<ClassifiedEntity>(process.env.DB_FIDELIDADE || '', "CLASSIFIED", ["ID"], ClassifiedEntity);

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
}