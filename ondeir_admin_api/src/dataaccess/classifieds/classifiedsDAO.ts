import { BaseDAO } from '../baseDAO';
import { CrudDAO } from '../crudDAO';

import { StoreEntity } from '../../../../ondeir_admin_shared/models/classifieds/store.model';
import { DbConnection } from '../../config/dbConnection';

export class ClassifiedsDAO extends BaseDAO {
    private listStoresQuery: string = `SELECT S.OWNER_ID, O.TITLE, O.OWNER_NAME, S.TYPE, S.STATUS 
                                         FROM STORE S, OWNER O WHERE S.OWNER_ID = O.ID`

    public Stores: CrudDAO<StoreEntity> = new CrudDAO<StoreEntity>(process.env.DB_FIDELIDADE || '', "STORE", ["OWNER_ID"], StoreEntity);

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
}