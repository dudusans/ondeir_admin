import { Response } from 'express';

import { BaseDAO } from "../baseDAO";
import { UserEntity } from './../../../../ondeir_admin_shared/models/users/userEntity';

export class UsersDAO extends BaseDAO { 
    private GetUserOndeIrQuery: string = "SELECT * FROM USERS WHERE ONDE_IR_ID = ?";
    private insertQuery: string = "INSERT INTO USERS SET ?";

    constructor() {
        super();
    }

    public GetUserByOndeIr(id: number, res: Response,  callback) {
        this.connDb.Connect(
            connection => {

                const query = connection.query(this.GetUserOndeIrQuery, id, (error, results) => {
                    if (!error && results.length > 0) {
                       
                        let ownerItem = new UserEntity();
                        ownerItem.fromMySqlDbEntity(results[0]);

                        connection.release();
                        return callback(res, error, ownerItem);
                    }

                    connection.release();
                    return callback(res, error, null);
                });
            }, 
            error => {
                return callback(res, error, null);
            }
        );
    }

    public Create = (user: UserEntity, callback)  => {
        this.connDb.Connect(
            connection => {
                const dbEntity = user.toMysqlDbEntity(true);

                const query = connection.query(this.insertQuery, dbEntity, (error, results) => {
                    connection.release();
                    return callback(error, results);
                });
            }, 
            error => {
                callback(error, null);
            }
        );
    }

    public ListUsers(res: Response,  callback) {
        this.connDb.Connect(
            connection => {

                const query = connection.query("SELECT * FROM USERS", (error, results) => {
                    if (!error && results.length > 0) {
                        let list: Array<UserEntity>;
                        list = results.map(item => {
                            let typeItem = new UserEntity();
                            typeItem.fromMySqlDbEntity(item);

                            return typeItem;
                        });
                        
                        connection.release();
                        return callback(res, error, list);
                    }

                    connection.release();
                    return callback(res, error, null);
                });
            }, 
            error => {
                return callback(res, error, null);
            }
        );
    }
}