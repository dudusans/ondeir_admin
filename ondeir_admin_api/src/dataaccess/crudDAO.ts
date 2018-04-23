import { Response } from 'express';

import { DbConnection } from './../config/dbConnection';
import { BaseEntity } from '../../../ondeir_admin_shared/models/base/base.model';

export abstract class baseCRUD<T> {
    
    constructor(private ctor: NoParamConstructor<T>) {
    }

    protected CreateInstance(): T {
        return new this.ctor();
    }
}

export class CrudDAO<T extends BaseEntity> extends baseCRUD<T> {
    protected connDb: DbConnection;
    protected table: string = '';
    protected primaryKey: Array<string> = new Array<string>();
    protected whereKey: string = '';
    

    constructor(dbName: string, tableName: string, tableKey: Array<string>, entityType) {
        super(entityType);

        this.connDb = new DbConnection(dbName);

        this.table = tableName;
        this.primaryKey = tableKey;
        this.whereKey = "";

        tableKey.forEach(item => {
            if (this.whereKey === "") {
                this.whereKey += `${item} = ?`;
            } else {
                this.whereKey += ` AND ${item} = ?`;
            }
        });
    }

    public ListAllItems = (res: Response, callback) => {
        const query = `SELECT * FROM ${this.table}`;

        this.ProcessListQuery(query, res, callback);
    }

    public ListFilteredItems = (whereFields: Array<string>, keyFilter: Array<string>, res: Response, callback) => {
        let where: string = "";

        whereFields.forEach(item => {
            if (where === "") {
                where += `${item} = ?`;
            } else {
                where += ` AND ${item} = ?`;
            }
        });

        const query = `SELECT * FROM ${this.table} WHERE ${where}`;

        this.ProcessListFilteredQuery(query, keyFilter, res, callback);
    }

    public SearchItems = (searchField: string, keyFilter: string, res: Response, callback) => {
        let where: string = `${searchField} like '%${keyFilter}%'`;

        const query = `SELECT * FROM ${this.table} WHERE ${where}`;

        this.ProcessListFilteredQuery(query, [keyFilter], res, callback);
    }

    public GetItem = (keyFilter: Array<string>, res: Response, callback) => {
        const query = `SELECT * FROM ${this.table} WHERE ${this.whereKey}`;

        this.ProcessGetQuery(query, keyFilter, res, callback);
    }

    public CreateItem = (newItem: T, res: Response, callback) => {
        const query = `INSERT INTO ${this.table} SET ?`;

        this.connDb.Connect(
            connection => { 
                const dbEntity = newItem.toMysqlDbEntity(true);

                connection.query(query, dbEntity, (error, results) => { 
                    connection.release();
                    return callback(res, error, results);
                });
            },
            error => {
                callback(res, error, null);
            }
        );
    }

    public UpdateItem = (newItem: T, keyFilter: Array<string>, res: Response, callback) => {
        const query = `UPDATE ${this.table} SET ? WHERE ${this.whereKey}`;

        this.connDb.Connect(
            connection => { 
                const dbEntity = newItem.toMysqlDbEntity(true);

                connection.query(query, [dbEntity, keyFilter], (error, results) => { 
                    connection.release();
                    return callback(res, error, results);
                });
            },
            error => {
                callback(res, error, null);
            }
        );
    }

    public DeleteItem = (keyFilter: Array<string>, res: Response, callback) => {
        const query = `DELETE FROM ${this.table} WHERE ${this.whereKey}`;

        this.connDb.Connect(
            connection => {

                connection.query(query, keyFilter, (error, results) => {
                    connection.release();
                    return callback(res, error, results);
                });

            }, 
            error => {
                callback(error, null);
            }
        );
    }

    /** Metodos de apoio */
    protected ProcessListQuery(query: string, res: Response, callback) {
        this.connDb.Connect(
            connection => { 
                connection.query(query, (error, results) => {
                    if (!error) {
                        let list: Array<T>;
                        list = results.map(item => {
                            let planItem = this.CreateInstance();
                            planItem.fromMySqlDbEntity(item);

                            return planItem;
                        });

                        connection.release();
                        return callback(res, error, list);
                    }

                    connection.release();
                    return callback(res, error, null);
                });
            },
            error => {
                callback(res, error, null);
            }
        );
    }

    protected ProcessListFilteredQuery(query: string, where: Array<string>, res: Response, callback) {
        this.connDb.Connect(
            connection => { 
                connection.query(query, where, (error, results) => {
                    if (!error) {
                        let list: Array<T>;
                        list = results.map(item => {
                            let planItem = this.CreateInstance();
                            planItem.fromMySqlDbEntity(item);

                            return planItem;
                        });

                        connection.release();
                        return callback(res, error, list);
                    }

                    connection.release();
                    return callback(res, error, null);
                });
            },
            error => {
                callback(res, error, null);
            }
        );
    }
    
    protected ProcessGetQuery(query: string, where: Array<string>, res: Response, callback) {
        this.connDb.Connect(
            connection => { 
                connection.query(query, where, (error, results) => {
                    if (!error && results.length > 0) {
                        let planItem = this.CreateInstance();
                        planItem.fromMySqlDbEntity(results[0]);

                        connection.release();
                        return callback(res, error, planItem);
                    }

                    connection.release();
                    return callback(res, error, null);
                });
            },
            error => {
                callback(res, error, null);
            }
        );
    } 
}

interface NoParamConstructor<T> {
    new (): T;
}