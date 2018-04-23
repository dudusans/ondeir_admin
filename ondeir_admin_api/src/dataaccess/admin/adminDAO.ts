import { BaseDAO } from '../baseDAO';
import { CrudDAO } from '../crudDAO';

import { SystemEntity } from '../../../../ondeir_admin_shared/models/admin/system.model';

export class AdminDAO extends BaseDAO {
    public Screens: CrudDAO<SystemEntity> = new CrudDAO<SystemEntity>(process.env.DB_FIDELIDADE || '', "SYSTEMS", ["ID"], SystemEntity);

    constructor() {
        super();
    }
}