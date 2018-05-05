import { Request, Response } from "express";
import * as cloudinary from 'cloudinary';

import { BaseController } from './base.controller';
import { ServiceResult } from '../../../ondeir_admin_shared/models/base/serviceResult.model';
import { SystemEntity } from '../../../ondeir_admin_shared/models/admin/system.model';
import { AdminErrorsProvider, EAdminErrors } from '../config/errors/admin.errors';
import { ClassifiedsDAO } from '../dataaccess/classifieds/classifiedsDAO';
import { StoreEntity, EStoreType } from "../../../ondeir_admin_shared/models/classifieds/store.model";
import { MotorsEntity } from "../../../ondeir_admin_shared/models/classifieds/motors.model";
import { ClassifiedEntity } from "../../../ondeir_admin_shared/models/classifieds/classified.model";
import { ClassifiedsErrorsProvider, EClassifiedsErrors } from '../config/errors/classifieds.errors';
import { json } from "body-parser";

export class ClassifiedsController extends BaseController {
    private dataAccess: ClassifiedsDAO = new ClassifiedsDAO();

    // Metodos de manupulação de Lojas
    public ListStores = (req: Request, res: Response) => {
        req.checkParams("id").isNumeric();
        const errors = req.validationErrors();

        if (errors) {
            return this.dataAccess.Stores.ListAllItems(res, this.processDefaultResult);
        } 
        else {
            return this.dataAccess.ListStores(req.params["id"], res, this.processDefaultResult);
        }
    }

    public GetStore = (req: Request, res: Response) => {
        req.checkParams("id").isNumeric();

        const errors = req.validationErrors();
        if (errors) {
            return res.json(AdminErrorsProvider.GetErrorDetails(EAdminErrors.InvalidId, errors));
        }

        const id = req.params["id"];        

        this.dataAccess.Stores.GetItem([id], res, (res, err, result: SystemEntity) => {
            if (err) { 
                return res.json(ServiceResult.HandlerError(err));
            }

            return res.json(ServiceResult.HandlerSuccessResult(result));            
        } );
    }

    public CreateStore = (req: Request, res: Response) => {
        // Validação dos dados de entrada
        

        // Verifica se a entidade tem erros
        const errors = req.validationErrors();
        if (errors) {
            return res.json(AdminErrorsProvider.GetErrorDetails(EAdminErrors.InvalidRequiredParams, errors));
        }

        let store: StoreEntity = StoreEntity.GetInstance();
        store.Map(req.body);
    
        this.dataAccess.Stores.CreateItem(store, res, (res, err, result) => { 
            if (err) { 
                return res.json(ServiceResult.HandlerError(err));
            }            
        });
    }

    public UpdateStore = (req: Request, res: Response) => {
        // Validação dos dados de entrada
        req.checkBody({
            ownerId: {
                isNumeric: true,
                errorMessage: "Id da tela é obrigatório"
            }
        });

        // Verifica se a entidade tem erros
        const errors = req.validationErrors();
        if (errors) {
            return res.json(AdminErrorsProvider.GetErrorDetails(EAdminErrors.InvalidRequiredParams, errors));
        }

        let store: StoreEntity = StoreEntity.GetInstance();
        store.Map(req.body);

        let imageLogo = store.logo;
        let imageHeader = store.header;

        if (imageLogo.indexOf("http") >= 0) {
            imageLogo = "";
        }

        if (imageHeader.indexOf("http") >= 0) {
            imageHeader = "";
        }

        //Upload imagem
      if ((imageLogo && imageLogo.length > 0) || (imageHeader && imageHeader.length > 0)) {
        cloudinary.config({ 
          cloud_name: 'ondeirfidelidade', 
          api_key: process.env.CLOUDNARY_KEY, 
          api_secret: process.env.CLOUDNARY_SECRET  
        });

        if (imageLogo && imageLogo.length > 0) {
            cloudinary.uploader.upload(imageLogo, (ret) => {
                if (ret && !ret.error) {
                  store.logo = ret.url.replace("/image/upload", "/image/upload/t_fidelidadeimages").replace(".png", ".jpg").replace("http", "https");
      
                    if (imageHeader && imageHeader.length > 0) {
                        cloudinary.uploader.upload(imageHeader, (ret) => {
                            if (ret && !ret.error) {
                              store.header = ret.url.replace("/image/upload", "/image/upload/t_fidelidadeimages").replace(".png", ".jpg").replace("http", "https");
                  
                              this.dataAccess.Stores.UpdateItem(store, [store.ownerId.toString()], res, (res, err, result) => { 
                                  if (err) { 
                                      return res.json(ServiceResult.HandlerError(err));
                                  }
                      
                                  return res.json(ServiceResult.HandlerSucess());
                              });
                            } else {
                              return res.json(AdminErrorsProvider.GetError(EAdminErrors.LogoUploadError));
                            }
                          });
                    } else {
                        this.dataAccess.Stores.UpdateItem(store, [store.ownerId.toString()], res, (res, err, result) => { 
                            if (err) { 
                                return res.json(ServiceResult.HandlerError(err));
                            }
                
                            return res.json(ServiceResult.HandlerSucess());
                        });
                    }
                } else {
                  return res.json(AdminErrorsProvider.GetError(EAdminErrors.LogoUploadError));
                }
              });
        } else {
            cloudinary.uploader.upload(imageHeader, (ret) => {
                if (ret && !ret.error) {
                  store.header = ret.url.replace("/image/upload", "/image/upload/t_fidelidadeimages").replace(".png", ".jpg").replace("http", "https");
      
                  this.dataAccess.Stores.UpdateItem(store, [store.ownerId.toString()], res, (res, err, result) => { 
                      if (err) { 
                          return res.json(ServiceResult.HandlerError(err));
                      }
          
                      return res.json(ServiceResult.HandlerSucess());
                  });
                } else {
                  return res.json(AdminErrorsProvider.GetError(EAdminErrors.LogoUploadError));
                }
              });
        }
        
        

        
      } else {
        this.dataAccess.Stores.UpdateItem(store, [store.ownerId.toString()],res, this.processDefaultResult);
      }

        
    }

    public DeleteStore = (req: Request, res: Response) => {
        req.checkParams("id").isNumeric();

        const errors = req.validationErrors();
        if (errors) {
            return res.json(AdminErrorsProvider.GetErrorDetails(EAdminErrors.InvalidId, errors));
        }

        const id = req.params["id"];

        this.dataAccess.Stores.DeleteItem([id], res, (res, err, result) => { 
            if (err) { 
                return res.json(ServiceResult.HandlerError(err));
            }

            return res.json(ServiceResult.HandlerSucess());
        });
    }

    /** Contacts Methods */
    public ListContact = (req: Request, res: Response) => {
        req.checkParams("ownerId").isNumeric();
        const errors = req.validationErrors();

        if (errors) {
            return this.dataAccess.ListOwnerContacts(-1, res, this.processDefaultResult);
        } 
        else {
            return this.dataAccess.ListOwnerContacts(req.params["ownerId"], res, this.processDefaultResult);
        }
    }

    public ListClassifiedContacts = (req: Request, res: Response) => {
        req.checkParams("id").isNumeric();
        const errors = req.validationErrors();

        return this.dataAccess.Contacts.ListFilteredItems(["CLASSIFIED_ID"],req.params["id"], res, this.processDefaultResult);
    }

    /** PRODUCTS METHODS */
    public ListOwnerProducts = (req: Request, res: Response) => {
        req.checkParams("ownerId").isNumeric();
        const errors = req.validationErrors();

        if (errors || req.params["ownerId"] === "-1") {
            return this.dataAccess.Classifieds.ListAllItems(res, this.processDefaultResult);
        } 
        else {
            return this.dataAccess.Classifieds.ListFilteredItems(["OWNER_ID"], req.params["ownerId"], res, this.processDefaultResult);
        }
    }

    public ListProducts = (req: Request, res: Response) => {
        return this.dataAccess.Classifieds.ListFilteredItems(["ACTIVE"], ["1"], res, this.processDefaultResult);
    }

    public ListAssemblers = (req: Request, res: Response) => {
        return this.dataAccess.Assemblers.ListAllItems(res, this.processDefaultResult);
    }

    public GetProduct = (req: Request, res: Response) => {
        req.checkParams("id").isNumeric();

        const errors = req.validationErrors();
        if (errors) {
            return res.json(AdminErrorsProvider.GetErrorDetails(EAdminErrors.InvalidId, errors));
        }

        const id = req.params["id"];

        this.dataAccess.Classifieds.GetItem([id], res, (err, product) => {
            if (err) {
                return res.json(ServiceResult.HandlerError(err));
            }

        
        });
    }

    public CreateMotorClassified = (req: Request, res: Response) => {
        req.checkBody({
            ownerId: {
                isNumeric: true,
                errorMessage: "Id do anunciante é Obrigatório"
            },
            title: {
                notEmpty: true,
                errorMessage: "Título do Anúncio é Obrigatório"
            },
            description: {
                notEmpty: true,
                errorMessage: "Descrição do anúncio é obrigatória"
            },
            color: {
                notEmpty: true,
                errorMessage: "Cor do veículo é obrigatória"
            },
            cost: {
                isNumeric: true,
                errorMessage: "Valor é obrigatório"
            },
            assemblerId: {
                isNumeric: true,
                errorMessage: "Montadora é obrigatório"
            },
            year: {
                isNumeric: true,
                errorMessage: "Ano de Fabricação inválido"
            },
            plateNumber: {
                isNumeric: true,
                errorMessage: "Final da placa inválido"
            },
            gear: {
                exists: true,
                errorMessage: "Tipo de cambio inválido"
            },
            gasType: {
                exists: true,
                errorMessage: "Tipo de combustivel inválido"
            },
            model: {
                exists: true,
                errorMessage: "Tipo de carroceria inválido"
            }
        });

        const errors = req.validationErrors();
        if (errors) {
            return res.json(ClassifiedsErrorsProvider.GetErrorDetails(EClassifiedsErrors.InvalidMotorsRequiredParams, errors));
        }

        let motor: MotorsEntity = MotorsEntity.GetInstance();
        motor.Map(req.body);
        //Mapeando o Pai
        motor.classified = ClassifiedEntity.GetInstance();
        motor.classified.Map(req.body.classified);

        this.dataAccess.Classifieds.CreateItem(motor.classified, res, (err, result) => {
            if (err) {
                return res.json(ServiceResult.HandlerError(err));
            }

            motor.classified.id = result.insertId;

            return this.dataAccess.Motors.CreateItem(motor, res, this.processDefaultResult);
        });
    }

    /** Module Access Methods */
    public SetAccess = (req: Request, res: Response) => {
        req.checkParams("id").isNumeric();

        const errors = req.validationErrors();
        if (errors) {
            return res.json(AdminErrorsProvider.GetErrorDetails(EAdminErrors.InvalidId, errors));
        }

        const ownerId = req.params["id"];

        const store: StoreEntity = StoreEntity.GetInstance();
        store.ownerId = ownerId;
        store.active = false;
        store.type = EStoreType.Undefined;

        this.dataAccess.Stores.CreateItem(store, res, (res, err, result) => { 
            if (err) { 
                return res.json(ServiceResult.HandlerError(err));
            }  
            
            return res.json(ServiceResult.HandlerSuccessResult(result));
        });
    }

    public RevokeAccess = (req: Request, res: Response) => {
        req.checkParams("id").isNumeric();

        const errors = req.validationErrors();
        if (errors) {
            return res.json(AdminErrorsProvider.GetErrorDetails(EAdminErrors.InvalidId, errors));
        }

        const id = req.params["id"];

        this.dataAccess.Stores.DeleteItem([id], res, (res, err, result) => { 
            if (err) { 
                return res.json(ServiceResult.HandlerError(err));
            }

            return res.json(ServiceResult.HandlerSucess());
        });
    }
}