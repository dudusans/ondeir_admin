import { BaseDAO } from '../baseDAO';
import { CrudDAO } from '../crudDAO';

import { StoreEntity } from '../../../../ondeir_admin_shared/models/classifieds/store.model';

export class ClassifiedsDAO extends BaseDAO {
    public Screens: CrudDAO<StoreEntity> = new CrudDAO<StoreEntity>(process.env.DB_FIDELIDADE || '', "STORE", ["OWNER_ID"], StoreEntity);

    constructor() {
        super();
    }
}