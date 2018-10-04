import { UsersDAO } from './../dataaccess/user/usersDAO';
import { Request, Response } from "express";
import * as cloudinary from 'cloudinary';

import { BaseController } from './base.controller';
import { ServiceResult } from '../../../ondeir_admin_shared/models/base/serviceResult.model';
import { SystemEntity } from '../../../ondeir_admin_shared/models/admin/system.model';
import { AdminErrorsProvider, EAdminErrors } from '../config/errors/admin.errors';
import { ClassifiedsDAO } from '../dataaccess/classifieds/classifiedsDAO';
import { StoreEntity, EStoreType } from "../../../ondeir_admin_shared/models/classifieds/store.model";
import { MotorsEntity } from "../../../ondeir_admin_shared/models/classifieds/motors.model";
import { EstatesEntity } from "../../../ondeir_admin_shared/models/classifieds/estates.model";
import { ClassifiedEntity } from "../../../ondeir_admin_shared/models/classifieds/classified.model";
import { ClassifiedPhotoEntity } from "../../../ondeir_admin_shared/models/classifieds/classifiedPhotos.model";
import { ClassifiedsErrorsProvider, EClassifiedsErrors } from '../config/errors/classifieds.errors';
import { json } from "body-parser";
import { ContactEntity } from '../../../ondeir_admin_shared/models/classifieds/contact.model';
import { UserEntity } from '../../../ondeir_admin_shared/models/users/userEntity';

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

    public InsertMessage = (req: Request, res: Response) => {
        // Verifica se a entidade tem erros
        const errors = req.validationErrors();
        if (errors) {
            return res.json(AdminErrorsProvider.GetErrorDetails(EAdminErrors.InvalidRequiredParams, errors));
        }

        const userId: number = req.body.userId;
        const classifiedId: number = req.body.classifiedId;
        const message: string = req.body.message;

        const userDataAccess: UsersDAO = new UsersDAO();
        userDataAccess.GetUserByOndeIr(userId, res, (r, e, user: UserEntity) => {
            if (e) {
                return res.json(ServiceResult.HandlerError(e));
            }

            const contact: ContactEntity = ContactEntity.GetInstance();
            contact.message = message;
            contact.classifiedId = classifiedId;
            contact.name = user.Name;
            contact.email = user.Email;
            contact.contactDate = new Date();

            this.dataAccess.Contacts.CreateItem(contact, res, this.processDefaultResult);
        });
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

    public StoreIndicators = (req: Request, res: Response) => {
        req.checkParams("id").isNumeric();
        const errors = req.validationErrors();

        if (errors) {
            return res.json(ServiceResult.HandlerError(ClassifiedsErrorsProvider.GetError(EClassifiedsErrors.InvalidRequiredParams)));
        } 
        else {
            return this.dataAccess.StoreIndicators(req.params["id"], res, this.processDefaultResult);
        }    
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

    public ListCarProducts = (req: Request, res: Response) => {
        req.checkParams("cityId").isNumeric();
        req.checkParams("assembler").isNumeric();
        const errors = req.validationErrors();

        this.dataAccess.ListClassifiedsMotors(req.params["cityId"], req.params["assembler"], (err, ret) => {
            if (err) {
                return res.json(ServiceResult.HandlerError(err));
            }

            return res.json(ServiceResult.HandlerSuccessResult(ret));
        });
    }

    public ListEstatesProducts = (req: Request, res: Response) => {
        req.checkParams("cityId").isNumeric();
        req.checkParams("type").isNumeric();
        const errors = req.validationErrors();

        this.dataAccess.ListClassifiedsEstates(req.params["cityId"], req.params["type"], (err, ret) => {
            if (err) {
                return res.json(ServiceResult.HandlerError(err));
            }

            return res.json(ServiceResult.HandlerSuccessResult(ret));
        });
    }

    public ListAssemblers = (req: Request, res: Response) => {
        return this.dataAccess.Assemblers.ListAllItems(res, this.processDefaultResult);
    }

    public GetProduct = (req: Request, res: Response) => {
        req.checkParams("id").isNumeric();
        req.checkParams("type").isNumeric();

        const errors = req.validationErrors();
        if (errors) {
            return res.json(AdminErrorsProvider.GetErrorDetails(EAdminErrors.InvalidId, errors));
        }

        const id = req.params["id"];
        const type = req.params["type"];

        if (type == 1) {
            return this.dataAccess.GetMotorClassified(id, res, this.processDefaultResult);
        } else if (type == 2) {
            return this.dataAccess.GetEstatesClassified(id, res, this.processDefaultResult);
        }
    }

    public CreateMotorClassified = (req: Request, res: Response) => {
        req.checkBody({
            classified: {
                exists: true,
                errorMessage: "Id do anunciante é Obrigatório"
            },
            color: {
                notEmpty: true,
                errorMessage: "Cor do veículo é obrigatória"
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

        this.dataAccess.Classifieds.CreateItem(motor.classified, res, (r, err, result) => {
            if (err) {
                return res.json(ServiceResult.HandlerError(err));
            }

            motor.classified.id = result.insertId;

            this.dataAccess.Motors.CreateItem(motor, res, (r,e,i) => {
                if (e) {
                    return res.json(ServiceResult.HandlerError(e));                    
                }

                return res.json(ServiceResult.HandlerSuccessResult(motor.classified.id));
            });
        });
    }    

    public UpdateMotorClassified = (req: Request, res: Response) => {
        req.checkBody({
            classified: {
                exists: true,
                errorMessage: "Id do anunciante é Obrigatório"
            },
            color: {
                notEmpty: true,
                errorMessage: "Cor do veículo é obrigatória"
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

        this.dataAccess.Classifieds.UpdateItem(motor.classified, [motor.classified.id.toString()], res, (r, err, result) => {
            if (err) {
                return res.json(ServiceResult.HandlerError(err));
            }

            this.dataAccess.Motors.UpdateItem(motor, [motor.classified.id.toString()], res, (r,e,i) => {
                if (e) {
                    return res.json(ServiceResult.HandlerError(e));                    
                }

                return res.json(ServiceResult.HandlerSuccessResult(motor.classified.id));
            });
        });
    }

    public CreateEstatesClassified = (req: Request, res: Response) => {
        req.checkBody({
            classified: {
                exists: true,
                errorMessage: "Id do anunciante é Obrigatório"
            },
            type: {
                notEmpty: true,
                errorMessage: "Tipo é obrigatória"
            },
            totalArea: {
                isNumeric: true,
                errorMessage: "Área total é obrigatório"
            },
            salesType: {
                exists: true,
                errorMessage: "Tipo do anúncio é inválido"
            },
            address: {
                exists: true,
                errorMessage: "Endereço é obrigatório"
            }
        });

        const errors = req.validationErrors();
        if (errors) {
            return res.json(ClassifiedsErrorsProvider.GetErrorDetails(EClassifiedsErrors.InvalidMotorsRequiredParams, errors));
        }

        let estates: EstatesEntity = EstatesEntity.GetInstance();
        estates.Map(req.body);
        //Mapeando o Pai
        estates.classified = ClassifiedEntity.GetInstance();
        estates.classified.Map(req.body.classified);

        this.dataAccess.Classifieds.CreateItem(estates.classified, res, (r, err, result) => {
            if (err) {
                return res.json(ServiceResult.HandlerError(err));
            }

            estates.classified.id = result.insertId;

            this.dataAccess.Estates.CreateItem(estates, res, (r,e,i) => {
                if (e) {
                    return res.json(ServiceResult.HandlerError(e));                    
                }

                return res.json(ServiceResult.HandlerSuccessResult(estates.classified.id));
            });
        });
    }

    public UpdateEstatesClassified = (req: Request, res: Response) => {
        req.checkBody({
            classified: {
                exists: true,
                errorMessage: "Id do anunciante é Obrigatório"
            },
            type: {
                notEmpty: true,
                errorMessage: "Tipo é obrigatória"
            },
            totalArea: {
                isNumeric: true,
                errorMessage: "Área total é obrigatório"
            },
            salesType: {
                exists: true,
                errorMessage: "Tipo do anúncio é inválido"
            },
            address: {
                exists: true,
                errorMessage: "Endereço é obrigatório"
            }
        });

        const errors = req.validationErrors();
        if (errors) {
            return res.json(ClassifiedsErrorsProvider.GetErrorDetails(EClassifiedsErrors.InvalidMotorsRequiredParams, errors));
        }

        let estates: EstatesEntity = EstatesEntity.GetInstance();
        estates.Map(req.body);
        //Mapeando o Pai
        estates.classified = ClassifiedEntity.GetInstance();
        estates.classified.Map(req.body.classified);

        this.dataAccess.Classifieds.UpdateItem(estates.classified, [estates.classified.id.toString()], res, (r, err, result) => {
            if (err) {
                return res.json(ServiceResult.HandlerError(err));
            }

            this.dataAccess.Estates.UpdateItem(estates, [estates.classified.id.toString()], res, (r,e,i) => {
                if (e) {
                    return res.json(ServiceResult.HandlerError(e));                    
                }

                return res.json(ServiceResult.HandlerSuccessResult(estates.classified.id));
            });
        });
    }

    public UploadClassifiedPhotos = (req: Request, res: Response) => {
        req.checkBody({
            photos: {
                exists: true,
                errorMessage: "Imagens são Obrigatórias"
            }
        });

        const errors = req.validationErrors();
        if (errors) {
            return res.json(ClassifiedsErrorsProvider.GetErrorDetails(EClassifiedsErrors.InvalidMotorsRequiredParams, errors));
        }

        cloudinary.config({ 
            cloud_name: 'ondeirfidelidade', 
            api_key: process.env.CLOUDNARY_KEY, 
            api_secret: process.env.CLOUDNARY_SECRET  
          });

        let uploadedImages = 0;
        
        this.dataAccess.ClearClassifiedPhotos(req.body.photos[0].classifiedId, (errors, ok) => {
            if (errors) {
                return res.json(ServiceResult.HandlerError(errors));
            }

            req.body.photos.forEach(element => {
                let img: ClassifiedPhotoEntity = ClassifiedPhotoEntity.GetInstance();
                img.Map(element);
    
                if (!element.id || element.id === 0) {
                    cloudinary.uploader.upload(element.image, (ret) => {
                        uploadedImages += 1;
                        if (ret) {
                            img.image = ret.url.replace("/image/upload", "/image/upload/t_fidelidadeimages").replace(".png", ".jpg").replace("http", "https");

                            this.dataAccess.Photos.CreateItem(img, res, (r, e, i) => {
                                if (!e) {
                                    img.id = i.insertId;
                                } else {
                                    img.id = -1;
                                }
                            });
                        } else {
                            img.id = -1;
                            //return res.json(ClassifiedsErrorsProvider.GetError(EClassifiedsErrors.LogoUploadError));
                        }

                        if (uploadedImages === req.body.photos.length) {
                            return res.json(ServiceResult.HandlerSucess());
                        }
                    });
                } else {
                    this.dataAccess.Photos.CreateItem(img, res, (r, e, i) => {
                        uploadedImages += 1;

                        if (!e) {
                            img.id = i.insertId;
                        } else {
                            img.id = -1;
                        }

                        if (uploadedImages === req.body.photos.length) {
                            return res.json(ServiceResult.HandlerSucess());
                        }
                    });
                }
            });
        });
    }

    public DeleteProduct = (req: Request, res: Response) => {
        req.checkParams("id").isNumeric();

        const errors = req.validationErrors();
        if (errors) {
            return res.json(AdminErrorsProvider.GetErrorDetails(EAdminErrors.InvalidId, errors));
        }

        const id = req.params["id"];

        this.dataAccess.Classifieds.DeleteItem([id], res, (res, err, result) => { 
            if (err) { 
                return res.json(ServiceResult.HandlerError(err));
            }

            return res.json(ServiceResult.HandlerSucess());
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