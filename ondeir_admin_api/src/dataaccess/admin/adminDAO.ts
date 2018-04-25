import { BaseDAO } from '../baseDAO';
import { CrudDAO } from '../crudDAO';

import { SystemEntity } from '../../../../ondeir_admin_shared/models/admin/system.model';
import { SystemReportsEntity } from '../../../../ondeir_admin_shared/models/admin/systemReports.model';

export class AdminDAO extends BaseDAO {
    public Screens: CrudDAO<SystemEntity> = new CrudDAO<SystemEntity>(process.env.DB_FIDELIDADE || '', "SYSTEMS", ["ID"], SystemEntity);
    public Reports: CrudDAO<SystemReportsEntity> = new CrudDAO<SystemReportsEntity>(process.env.DB_FIDELIDADE || '', "SYSTEM_REPORTS", ["ID"], SystemReportsEntity);

    constructor() {
        super();
    }
}