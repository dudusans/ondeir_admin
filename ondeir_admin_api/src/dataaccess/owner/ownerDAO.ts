import { Sequelize } from 'sequelize';
import { Response } from 'express';

import { DbConnection } from '../../config/dbConnection';
import { BaseDAO } from '../baseDAO';
import { DataAccessResult } from '../dataAccess.result';
import { OwnerEntity } from './../../../../ondeir_admin_shared/models/owner/ownerEntity';
import { SystemEntity } from '../../../../ondeir_admin_shared/models/admin/system.model';
import { SystemReportsEntity } from '../../../../ondeir_admin_shared/models/admin/systemReports.model';

export class OwnerDAO extends BaseDAO {

    // private insertQuery: string = "INSERT INTO OWNER (ONDE_IR_ID, TITLE, REGISTER_DATE, OWNER_NAME, EMAIL, CELLPHONE, LOGO, ONDE_IR_CITY, PASSWORD) VALUES ?";
    private insertQuery: string = "INSERT INTO OWNER SET ?";
    private listQuery: string = "SELECT * FROM OWNER";
    private listCityQuery: string = "SELECT * FROM OWNER WHERE ONDE_IR_CITY = ?";
    private getOwnerQuery: string = "SELECT * FROM OWNER WHERE ID = ?";
    private getOwnerByEmailQuery: string = "SELECT * FROM OWNER WHERE EMAIL = ?";
    private deleteOwnerQuery: string = "DELETE FROM OWNER WHERE ID = ?";
    private updatePasswordQuery: string = "UPDATE OWNER SET PASSWORD=? WHERE ID=?"
    private updateQuery: string = "UPDATE OWNER SET ? WHERE ID= ?"
    private getOwnerSystemAccessQuery: string = "SELECT * FROM OWNER_SYSTEMS WHERE OWNER_ID = ?";
    private deleteOwnerSystemAccessQuery: string = "DELETE FROM OWNER_SYSTEMS WHERE OWNER_ID = ? AND SYSTEM_ID = ?";
    private setOwnerSystemAccessQuery: string = "INSERT INTO OWNER_SYSTEMS SET ?";
    private getOwnerMenuAccessQuery: string = `SELECT S.* FROM OWNER_SYSTEMS OS, SYSTEMS S
                                               WHERE S.ID = OS.SYSTEM_ID AND OS.OWNER_ID = ?`;
    private getOwnerReportAccessQuery: string = `SELECT SR.SYSTEM_ID, S.NAME, SR.MENU_TITLE, SR.MENU_LOGO, SR.MENU_LINK 
                                                 FROM OWNER_SYSTEMS OS, SYSTEMS S, SYSTEM_REPORTS SR
                                                WHERE S.ID = OS.SYSTEM_ID 
                                                    AND S.ID = SR.SYSTEM_ID`;
    private getAdminReportAccessQuery: string = `SELECT SR.SYSTEM_ID, S.NAME, SR.MENU_TITLE, SR.MENU_LOGO, SR.MENU_LINK 
                                                   FROM SYSTEMS S, SYSTEM_REPORTS SR WHERE S.ID = SR.SYSTEM_ID`;
    constructor() {
        super();
    }

    /**
     * List all owners in database
    */
    public ListOwners = (res: Response, callback) => {
        this.connDb.Connect(
            connection => {

                const query = connection.query(this.listQuery, (error, results) => {
                    if (!error) {
                        let list: Array<OwnerEntity>;
                        list = results.map(item => {
                            let ownerItem = new OwnerEntity();
                            ownerItem.fromMySqlDbEntity(item);

                            return ownerItem;
                        });

                        connection.release();
                        return callback(res, error, list);
                    }

                    connection.release();
                    callback(res, error, results);
                });
            }, 
            error => {
                callback(res, error, null);
            }
        );
    }

    public ListCityOwners = (city: number, res: Response, callback) => {
        // this.connDb.Connect(
        //     connection => {

        //         const query = connection.query(this.listCityQuery, [city], (error, results) => {
        //             if (!error) {
        //                 let list: Array<OwnerEntity>;
        //                 list = results.map(item => {
        //                     let ownerItem = new OwnerEntity();
        //                     ownerItem.fromMySqlDbEntity(item);

        //                     return ownerItem;
        //                 });

        //                 connection.release();
        //                 return callback(res, error, list);
        //             }

        //             connection.release();
        //             callback(res, error, results);
        //         });
        //     }, 
        //     error => {
        //         callback(res, error, null);
        //     }
        // );


        DbConnection.connectionPool.query(this.listCityQuery, [city], (error, results) => {
            if (!error) {
                let list: Array<OwnerEntity>;
                list = results.map(item => {
                    let ownerItem = new OwnerEntity();
                    ownerItem.fromMySqlDbEntity(item);

                    return ownerItem;
                });

                return callback(res, error, list);
            }

            callback(res, error, results);
        });
            
    }

    /**
     * Return an owner entity from database
    */
    public GetOwner(id: number, res: Response,  callback) {
        this.connDb.Connect(
            connection => {

                const query = connection.query(this.getOwnerQuery, id, (error, results) => {
                    if (!error && results.length > 0) {
                       
                        let ownerItem = new OwnerEntity();
                        ownerItem.fromMySqlDbEntity(results[0]);

                        connection.release();
                        return callback(res, error, ownerItem);
                    }

                    connection.release();
                    callback(res, error, results);
                });
            }, 
            error => {
                callback(res, error, null);
            }
        );
    }

    public GetOwnerByEmail(email: string, callback) {
        this.connDb.Connect(
            connection => {
                const query = connection.query(this.getOwnerByEmailQuery, email, (error, results) => {
                    if (!error && results.length > 0) {
                       
                        let ownerItem = new OwnerEntity();
                        ownerItem.fromMySqlDbEntity(results[0]);

                        connection.release();
                        return callback(error, ownerItem);
                    }

                    connection.release();
                    callback(error, null);
                });

                console.log(query.sql);
            }, 
            error => {
                callback(error, null);
            }
        );
    }

    /**
     * Remove an owner entity from database
    */
    public DeleteOwner(id: number, res: Response,  callback) {
        this.connDb.Connect(
            connection => {

                const query = connection.query(this.deleteOwnerQuery, id, (error, results) => {
                    if (!error && results.length > 0) {
                       
                        let ownerItem = new OwnerEntity();
                        ownerItem.fromMySqlDbEntity(results[0]);

                        connection.release();
                        return callback(res, error, ownerItem);
                    }

                    connection.release();
                    callback(res, error, null);
                });

                console.log(query.sql);
            }, 
            error => {
                callback(res, error, null);
            }
        );
    }

    /**
     * Create a new owner
     */
    public Create = (owner: OwnerEntity, callback)  => {
        this.connDb.Connect(
            connection => {
                const dbEntity = owner.toMysqlDbEntity(true);

                const query = connection.query(this.insertQuery, dbEntity, (error, results) => {
                    connection.release();
                    callback(error, results);
                });
            }, 
            error => {
                callback(error, null);
            }
        );
    }

    /**
     * UpdatePassword
     */
    public UpdatePassword = (memberId: number, password: string, res: Response, callback) => {
        this.connDb.Connect(
            connection => {
                const query = connection.query(this.updatePasswordQuery, [password, memberId], (error, results) => {
                    connection.release();
                    callback(res, error, null);
                });

                console.log(query);
            },
            error => {
                callback(res, error, null);
            }
        );
    }

    /**
     * Update Owner
     */
    public UpdateOwner = (owner: OwnerEntity, res: Response, callback) => {
        this.connDb.Connect(
            connection => {
                const dbOwner = owner.toMysqlDbEntity(false);

                const query = connection.query(this.updateQuery, [dbOwner, owner.id], (error, results) => {
                    connection.release();
                    callback(res, error, results);
                });
            },
            error => {
                callback(res, error, null);
            }
        );
    }

    public GetOwnerSystemAccess = (ownerId: number, res: Response, callback) => {
        DbConnection.connectionPool.query(this.getOwnerSystemAccessQuery, [ownerId], (error, result) => {
            if (error) {
                callback(res, error, null);                
            } else {
                callback(res, null, result.map(x=> x.SYSTEM_ID));
            }
        });
    }

    public GetOwnerMenuAccess = (ownerId: number, res: Response, callback) => {
        DbConnection.connectionPool.query(this.getOwnerMenuAccessQuery, [ownerId], (error, result) => {
            if (error) {
                callback(res, error, null);                
            } else {
                let list: Array<SystemEntity>;
                list = result.map(item => {
                    let systemItem = new SystemEntity();
                    systemItem.fromMySqlDbEntity(item);

                    return systemItem;
                });

                callback(res, null, list);
            }
        });
    }

    public GetOwnerReportAccess = (ownerId: number, res: Response, callback) => {
        let query: string = this.getOwnerReportAccessQuery;

        if (ownerId > 0) {
            query += " AND OS.OWNER_ID = ?";
        } else {
            query = this.getAdminReportAccessQuery;
        }

        DbConnection.connectionPool.query(query, [ownerId], (error, result) => {
            if (error) {
                callback(res, error, null);                
            } else {
                let list: Array<SystemReportsEntity>;
                list = result.map(item => {
                    let systemItem = new SystemReportsEntity();
                    systemItem.fromMySqlDbEntity(item);

                    return systemItem;
                });

                callback(res, null, list);
            }
        });
    }

    public SetOwnerSystemAccess = (systems: Array<any>, res: Response, callback) => {
        this.connDb.Connect(
            connection => {                
                let executed = 0;
                systems.forEach(item => {
                    const dbEntity = {
                        OWNER_ID: item.ownerId,
                        SYSTEM_ID: item.systemId
                    };
    
                    connection.query(this.setOwnerSystemAccessQuery, dbEntity, (er, re) => {
                        executed += 1;
                        if (er) {
                            connection.release();
                            return callback(res, er, null);
                        }

                        if (executed === systems.length) {
                            connection.release();
                            return callback(res, null, re);
                        }
                    });
                });
            },
            error => {
                callback(res, error, null);
            }
        );
    }

    public RevokeOwnerSystemAccess = (systems: Array<any>, res: Response, callback) => {
        this.connDb.Connect(
            connection => {                
                let executed = 0;
                systems.forEach(item => {
                    const dbEntity = {
                        OWNER_ID: item.ownerId,
                        SYSTEM_ID: item.systemId
                    };
    
                    connection.query(this.deleteOwnerSystemAccessQuery, [item.ownerId, item.systemId], (error, results) => { 
                        executed += 1;
                        if (error) {
                            connection.release();
                            return callback(res, error, null);
                        }
                        
                        if (executed === systems.length) {
                            connection.release();
                            return callback(res, null, results);
                        }
                    });
                });
            },
            error => {
                callback(res, error, null);
            }
        );
    }
}