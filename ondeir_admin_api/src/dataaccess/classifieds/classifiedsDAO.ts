import { BaseDAO } from '../baseDAO';
import { CrudDAO } from '../crudDAO';

import { StoreEntity } from '../../../../ondeir_admin_shared/models/classifieds/store.model';
import { ContactEntity } from '../../../../ondeir_admin_shared/models/classifieds/contact.model';
import { ClassifiedEntity } from '../../../../ondeir_admin_shared/models/classifieds/classified.model';
import { DbConnection } from '../../config/dbConnection';
import { MotorsEntity } from '../../../../ondeir_admin_shared/models/classifieds/motors.model';
import { MotorAssemblerEntity } from '../../../../ondeir_admin_shared/models/classifieds/motorsAssembler.model';
import { ClassifiedPhotoEntity } from '../../../../ondeir_admin_shared/models/classifieds/classifiedPhotos.model';
import { EstatesEntity } from '../../../../ondeir_admin_shared/models/classifieds/estates.model';

export class ClassifiedsDAO extends BaseDAO {
    private listStoresQuery: string = `SELECT S.OWNER_ID, O.TITLE, O.OWNER_NAME, S.TYPE, S.STATUS 
                                         FROM STORE S, OWNER O WHERE S.OWNER_ID = O.ID`;
    private listOwnerContactsQuery: string = `SELECT C.ID, C.NAME, C.EMAIL, C.CELLPHONE, C.CONTACT_DATE, CF.TITLE
                                                FROM CONTACTS C, CLASSIFIED CF
                                                WHERE C.CLASSIFIED_ID = CF.ID`;
    private getMotorClassifiedQuery: string = `SELECT C.ID, C.ACTIVE, C.TITLE, C.DESCRIPTION, C.COST, C.FEATURED, O.ONDE_IR_ID AS STORE_ID, C.OWNER_ID, CP.IMAGE_URL, CP.ID AS IMAGE_ID,
                                                    MA.ID AS ASSEMBLER_ID, MA.NAME, MA.LOGO, M.YEAR, M.COLOR, M.GEAR, M.GAS_TYPE, M.MODEL, M.QUILOMETERS, M.LABEL, M.PLATE_NUMBER,
                                                    O.TITLE AS OWNER_NAME, O.EMAIL, O.CELLPHONE, O.LOGO AS OWNER_LOGO
                                                FROM CLASSIFIED C LEFT JOIN CLASSIFIED_PHOTOS CP ON C.ID = CP.CLASSIFIED_ID,
                                                OWNER O, MOTORS M, MOTOR_ASSEMBLERS MA 
                                                WHERE C.OWNER_ID = O.ID
                                                AND C.ID = M.CLASSIFIED_ID
                                                AND M.ASSEMBLER_ID = MA.ID
                                                AND C.ID = ?`;
    private getEstatesClassifiedQuery: string = `SELECT C.ID, C.ACTIVE, C.TITLE, C.DESCRIPTION, C.COST, C.FEATURED, O.ONDE_IR_ID AS STORE_ID, C.OWNER_ID, CP.IMAGE_URL, CP.ID AS IMAGE_ID,
                                                        R.TYPE, R.TOTAL_AREA, R.AVALIABLE_AREA, R.BEDROOMS, R.BATHS, R.MASTERS, R.PARKING, R.REFERENCE, R.ADDRESS,
                                                        R.SALES_TYPE, O.TITLE AS OWNER_NAME, O.EMAIL, O.CELLPHONE, O.LOGO AS OWNER_LOGO
                                                    FROM CLASSIFIED C LEFT JOIN CLASSIFIED_PHOTOS CP ON C.ID = CP.CLASSIFIED_ID,
                                                    OWNER O, REAL_ESTATES R
                                                    WHERE C.OWNER_ID = O.ID
                                                    AND C.ID = R.CLASSIFIED_ID
                                                    AND C.ID = ?`;
    private clearClassifiedPhotosQuery: string = `DELETE FROM CLASSIFIED_PHOTOS WHERE CLASSIFIED_ID = ?`;
    private listClassifiedMotorsQuery: string = `SELECT C.ID, M.LABEL, C.TITLE, M.YEAR, C.COST, (SELECT CP.IMAGE_URL FROM CLASSIFIED_PHOTOS CP WHERE CP.CLASSIFIED_ID = M.CLASSIFIED_ID LIMIT 1) AS PHOTO
                                                    FROM CLASSIFIED C, MOTORS M, OWNER O
                                                    WHERE C.ID = M.CLASSIFIED_ID
                                                    AND C.OWNER_ID = O.ID
                                                    AND O.ONDE_IR_CITY = ?
                                                    AND M.ASSEMBLER_ID = ?
                                                    AND C.ACTIVE = 1`;
    private listClassifiedEstatesQuery: string = `SELECT C.ID, C.TITLE, C.COST, R.TYPE, (SELECT CP.IMAGE_URL FROM CLASSIFIED_PHOTOS CP WHERE CP.CLASSIFIED_ID = R.CLASSIFIED_ID LIMIT 1) AS PHOTO
                                                    FROM CLASSIFIED C, REAL_ESTATES R, OWNER O
                                                    WHERE C.ID = R.CLASSIFIED_ID
                                                    AND C.OWNER_ID = O.ID
                                                    AND O.ONDE_IR_CITY = ?
                                                    AND R.SALES_TYPE = ?
                                                    AND C.ACTIVE = 1`;
    private storeIndicatorsQuery: string = `SELECT 
                                            (SELECT COUNT(C.ID) FROM CLASSIFIED C WHERE C.OWNER_ID = ?) AS PRODUCTS,
                                            (SELECT COUNT(C.ID) FROM CLASSIFIED C, CONTACTS CT WHERE C.OWNER_ID = ? AND C.ID = CT.CLASSIFIED_ID) AS CONTACTS`;


    public Stores: CrudDAO<StoreEntity> = new CrudDAO<StoreEntity>(process.env.DB_FIDELIDADE || '', "STORE", ["OWNER_ID"], StoreEntity);
    public Contacts: CrudDAO<ContactEntity> = new CrudDAO<ContactEntity>(process.env.DB_FIDELIDADE || '', "CONTACTS", ["ID"], ContactEntity);
    public Classifieds: CrudDAO<ClassifiedEntity> = new CrudDAO<ClassifiedEntity>(process.env.DB_FIDELIDADE || '', "CLASSIFIED", ["ID"], ClassifiedEntity);
    public Motors: CrudDAO<MotorsEntity> = new CrudDAO<MotorsEntity>(process.env.DB_FIDELIDADE || '', "MOTORS", ["CLASSIFIED_ID"], MotorsEntity);
    public Estates: CrudDAO<EstatesEntity> = new CrudDAO<EstatesEntity>(process.env.DB_FIDELIDADE || '', "REAL_ESTATES", ["CLASSIFIED_ID"], EstatesEntity);
    public Assemblers: CrudDAO<MotorAssemblerEntity> = new CrudDAO<MotorAssemblerEntity>(process.env.DB_FIDELIDADE || '', "MOTOR_ASSEMBLERS", ["ID"], MotorAssemblerEntity);
    public Photos: CrudDAO<ClassifiedPhotoEntity> = new CrudDAO<ClassifiedPhotoEntity>(process.env.DB_FIDELIDADE || '', "CLASSIFIED_PHOTOS", ["ID"], ClassifiedPhotoEntity);

    constructor() {
        super();
    }

    public ClearClassifiedPhotos = (classifiedId: number, callback) => {
        DbConnection.connectionPool.query(this.clearClassifiedPhotosQuery, [classifiedId], (err, result) => {
            return callback(err, result);
        });
    }

    public StoreIndicators = (storeId: number, res,callback) => {
        DbConnection.connectionPool.query(this.storeIndicatorsQuery, [storeId, storeId], (err, result) => {
            return callback(res, err, result[0]);
        });
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

    public ListClassifiedsMotors = (cityId: number, assembler: number, callback) => {
        DbConnection.connectionPool.query(this.listClassifiedMotorsQuery, [cityId, assembler], (err, result) => { 
            if (err) {
                return callback(err, null);
            }

            return callback(null, result);
        });
    }

    public ListClassifiedsEstates = (cityId: number, type: number, callback) => {
        DbConnection.connectionPool.query(this.listClassifiedEstatesQuery, [cityId, type], (err, result) => { 
            if (err) {
                return callback(err, null);
            }

            return callback(null, result);
        });
    }

    public GetMotorClassified = (id: number, res, callback) => {
        DbConnection.connectionPool.query(this.getMotorClassifiedQuery, [id], (err, result) => {
            if (err) {
                return callback(res, err, null);
            }

            if (!result || result.length === 0){
                return callback(res, "Not Found", null);
            }

            let entity: MotorsEntity = MotorsEntity.GetInstance();
            entity.fromMySqlDbEntity(result[0]);
            entity.classified.owner.fromMySqlDbEntity(result[0]);
            entity.classified.owner.logo = result[0].OWNER_LOGO;
            entity.classified.photos = new Array<ClassifiedPhotoEntity>();

            result.forEach(element => {
                let photo: ClassifiedPhotoEntity = ClassifiedPhotoEntity.GetInstance();
                photo.fromMySqlDbEntity(element);

                entity.classified.photos.push(photo);
            });

            return callback(res, null, entity);
        });
    }

    public GetEstatesClassified = (id: number, res, callback) => {
        DbConnection.connectionPool.query(this.getEstatesClassifiedQuery, [id], (err, result) => {
            if (err) {
                return callback(res, err, null);
            }

            if (!result || result.length === 0){
                return callback(res, "Not Found", null);
            }

            let entity: EstatesEntity = EstatesEntity.GetInstance();
            entity.fromMySqlDbEntity(result[0]);
            entity.classified.owner.fromMySqlDbEntity(result[0]);
            entity.classified.owner.logo = result[0].OWNER_LOGO;
            entity.classified.photos = new Array<ClassifiedPhotoEntity>();

            result.forEach(element => {
                let photo: ClassifiedPhotoEntity = ClassifiedPhotoEntity.GetInstance();
                photo.fromMySqlDbEntity(element);

                entity.classified.photos.push(photo);
            });

            return callback(res, null, entity);
        });
    }
}