import { Request, Response } from "express";
import * as passgen from 'generate-password';
import {Md5} from 'ts-md5/dist/md5';
import * as cloudinary from 'cloudinary';
import * as mailchimp from 'mailchimp-api-v3';
// import { check, validationResult } from "express-validator/check";

import { BaseController } from "./base.controller";
import { OwnerDAO } from "./../dataaccess/owner/ownerDAO";
import { EOwnerErrors, OwnerErrorsProvider } from '../config/errors/ownerErrors';
import { ServiceResult } from '../../../ondeir_admin_shared/models/base/serviceResult.model';
import { OwnerEntity } from './../../../ondeir_admin_shared/models/owner/ownerEntity';

import {
  GenericErrorsProvider,
  EGenericErrors
} from "./../config/errors/genericErrors";

export class OwnerController extends BaseController {
  private dataAccess: OwnerDAO = new OwnerDAO();

  constructor() {
    super();
  }

  /*
  Listagem de membros
  */
  public listOwners = (req: Request, res: Response) => {
    req.checkParams("cityId").isNumeric();

    const errors = req.validationErrors();
    if (errors) {
      this.dataAccess.ListOwners(res, this.processDefaultResult);  
    } else {
      const cityId = req.params["cityId"];

      if (cityId > 0) {
        this.dataAccess.ListCityOwners(cityId, res, this.processDefaultResult);
      } else {
        this.dataAccess.ListOwners(res, this.processDefaultResult);
      }
      
    }
  };

  /**
   * Busca de um membro pro Id
   */
  public getOwner = (req: Request, res: Response) => {
    req.checkParams("id").isNumeric();

    const errors = req.validationErrors();
    if (errors) {
      return res.json(OwnerErrorsProvider.GetErrorDetails(EOwnerErrors.InvalidOwnerId, errors));
    }

    const ownerId = req.params["id"];

    this.dataAccess.GetOwner(ownerId, res, this.processDefaultResult);
  };

  /**
   * Criação de um novo membro na base
   */
  public createOwner = (req: Request, res: Response) => {
    if (req.body == null || req.body == undefined) {
      return res.json(GenericErrorsProvider.GetError(EGenericErrors.InvalidArguments));
    }

    // validações do corpo recebido
    req.checkBody({
        title: {
            notEmpty: true,
            errorMessage: "Título é Obrigatório"
        },
        ownerName: {
            notEmpty: true,
            errorMessage: "Nome do responsável é Obrigatório"
        },
        email: {
            isEmail: true,
            errorMessage: "E-mail inválido ou vazio"
        },
        ondeIrId: {
            exists: true,
            errorMessage: "Necessário um relacionamento com um estabelecimento do Onde Ir"
        }
    });

    const errors = req.validationErrors();
    if (errors) {
      return res.json(OwnerErrorsProvider.GetErrorDetails(EOwnerErrors.InvalidOwnerRequiredParams, errors));
    }

    let owner: OwnerEntity = OwnerEntity.getInstance();
    owner.Map(req.body);

    // Gerando senha
    const password = passgen.generate({length: 10, numbers: true, symbols: true, excludeSimilarCharacters: true});
    const originalPassword = password;
    owner.password = Md5.hashStr(password).toString();

    const imageLogo = owner.logo;
    owner.logo = "";

    // Inserindo o cliente no banco
    this.dataAccess.Create(owner, (err, result) => {
        if (err) {
            if (err.sqlMessage.indexOf('IDX_OWNER_EMAIL') >= 0) {
                return res.json(OwnerErrorsProvider.GetError(EOwnerErrors.EmailAlreadyExists));
            } else {
                return res.json(ServiceResult.HandlerError(err));
            }
        }

        // Enviar e-mail de boas vindas.
        const mail = new mailchimp(process.env.MAILCHIMP_KEY);
        mail.post('/lists/7e0195b430/members', {
          email_address: owner.email,
          status: 'subscribed',
          merge_fields : {
            FNAME: owner.ownerName,
            PASSWORD: originalPassword,
            CELLPHONE: owner.cellphone,
            PLACE: owner.title
          }
        });


        //Upload imagem
        if (imageLogo && imageLogo.length > 0) {
          cloudinary.config({ 
            cloud_name: 'ondeirfidelidade', 
            api_key: process.env.CLOUDNARY_KEY, 
            api_secret: process.env.CLOUDNARY_SECRET 
          });

          cloudinary.uploader.upload(imageLogo, (ret) => {
            if (ret) {
              owner.id = result.insertId;
              owner.logo = ret.url.replace("/image/upload", "/image/upload/t_fidelidadeimages").replace(".png", ".jpg").replace("http", "https");

              this.dataAccess.UpdateOwner(owner, res, (res, er, re) => {
                if (er) {
                  return res.json(ServiceResult.HandlerError(er));
                }

                return res.json(ServiceResult.HandlerSuccessResult(result.insertId));
              });
            } else {
              return res.json(OwnerErrorsProvider.GetError(EOwnerErrors.LogoUploadError));
            }
          });
        } else {
          return res.json(ServiceResult.HandlerSuccessResult(result.insertId));
        }

        
    });
  };

  public updateOwner = (req: Request, res: Response) => {
        // validações do corpo recebido
        req.checkBody({
          title: {
              notEmpty: true,
              errorMessage: "Título é Obrigatório"
          },
          ownerName: {
              notEmpty: true,
              errorMessage: "Nome do responsável é Obrigatório"
          },
          email: {
              isEmail: true,
              errorMessage: "E-mail inválido ou vazio"
          },
          ondeIrId: {
              exists: true,
              errorMessage: "Necessário um relacionamento com um estabelecimento do Onde Ir"
          }
      });
  
      const errors = req.validationErrors();
      if (errors) {
        return res.json(OwnerErrorsProvider.GetErrorDetails(EOwnerErrors.InvalidOwnerRequiredParams, errors));
      }
  
      let owner: OwnerEntity = OwnerEntity.getInstance();
      owner.Map(req.body);

      let imageLogo = owner.logo;

      if (imageLogo.indexOf("http") >= 0) {
        imageLogo = "";
      }
      //Upload imagem
      if (imageLogo && imageLogo.length > 0) {
        cloudinary.config({ 
          cloud_name: 'ondeirfidelidade', 
          api_key: process.env.CLOUDNARY_KEY, 
          api_secret: process.env.CLOUDNARY_SECRET  
        });

        cloudinary.uploader.upload(imageLogo, (ret) => {
          if (ret) {
            owner.logo = ret.url.replace("/image/upload", "/image/upload/t_fidelidadeimages").replace(".png", ".jpg").replace("http", "https");

            return this.dataAccess.UpdateOwner(owner, res, this.processDefaultResult);
          } else {
            return res.json(OwnerErrorsProvider.GetError(EOwnerErrors.LogoUploadError));
          }
        });
      } else {
        return this.dataAccess.UpdateOwner(owner, res, this.processDefaultResult);
      }
  };

  /**
   * updatePassword - Atualiza a senha de um cliente
  */
  public updatePassword = (req: Request, res: Response) => {
    req.checkBody({
      memberId: {
          notEmpty: true,
          errorMessage: "Código é Obrigatório"
      },
      password: {
          notEmpty: true,
          errorMessage: "Nova Senha é Obrigatório"
      }
    });

    const errors = req.validationErrors();
    if (errors) {
      return res.json(OwnerErrorsProvider.GetErrorDetails(EOwnerErrors.InvalidOwnerRequiredParams, errors));
    }

    const reqObj = (req.body as any);
    this.dataAccess.UpdatePassword(reqObj.memberId, reqObj.password, res, this.processDefaultResult);
  }

  /**
   * Exclui um cliente da base de dados
   */
  public deleteOwner = (req: Request, res: Response) => {
    req.checkParams("id").isNumeric();

    const errors = req.validationErrors();
    if (errors) {
      return res.json(OwnerErrorsProvider.GetErrorDetails(EOwnerErrors.InvalidOwnerId, errors));
    }

    const ownerId = req.params["id"];

    this.dataAccess.DeleteOwner(ownerId, res, this.processDefaultResult);
  };

  public resetPassword = (req: Request, res: Response) => {
    req.checkBody("email").isEmail();

    const errors = req.validationErrors();
    if (errors) {
      return res.json(OwnerErrorsProvider.GetErrorDetails(EOwnerErrors.InvalidOwnerRequiredParams, errors));
    }

    const email = (req.body as any).email;

    this.dataAccess.GetOwnerByEmail(email, (err, ret) => {
      if (err) {
        return res.json(ServiceResult.HandlerError(err));
      }

      if (ret) {
        // Gerando senha
        const password = passgen.generate({length: 10, numbers: true, symbols: true, excludeSimilarCharacters: true});
        const originalPassword = password;
        const newPassword = Md5.hashStr(password).toString();

        //Enviar email com nova senha
        
        this.dataAccess.UpdatePassword(ret.id, newPassword, res, this.processDefaultResult);
      } else {
        return res.json(OwnerErrorsProvider.GetError(EOwnerErrors.EmailNotFound));
      }
    })
  };

  public GetOwnerSystemAccess = (req: Request, res: Response) => {
    req.checkParams("id").isNumeric();

    const errors = req.validationErrors();
    if (errors) {
      return res.json(OwnerErrorsProvider.GetErrorDetails(EOwnerErrors.InvalidOwnerId, errors));
    }

    const ownerId = req.params["id"];

    this.dataAccess.GetOwnerSystemAccess(ownerId, res, this.processDefaultResult);
  }

  public SetOwnerSystemAccess = (req: Request, res: Response) => { 
    req.checkBody("systems").exists();

    const errors = req.validationErrors();
    if (errors) {
      return res.json(OwnerErrorsProvider.GetErrorDetails(EOwnerErrors.InvalidOwnerRequiredParams, errors));
    }

    const systems = (req.body as any).systems;

    this.dataAccess.SetOwnerSystemAccess(systems, res, this.processDefaultResult);
  }

  public RevokeOwnerSystemAccess = (req: Request, res: Response) => { 
    req.checkBody("systems").exists();

    const errors = req.validationErrors();
    if (errors) {
      return res.json(OwnerErrorsProvider.GetErrorDetails(EOwnerErrors.InvalidOwnerRequiredParams, errors));
    }

    const systems = (req.body as any).systems;

    this.dataAccess.RevokeOwnerSystemAccess(systems, res, this.processDefaultResult);
  }

  public GetOwnerMenuAccess = (req: Request, res: Response) => {
    req.checkParams("id").isNumeric();

    const errors = req.validationErrors();
    if (errors) {
      return res.json(OwnerErrorsProvider.GetErrorDetails(EOwnerErrors.InvalidOwnerId, errors));
    }

    const ownerId = req.params["id"];

    this.dataAccess.GetOwnerMenuAccess(ownerId, res, this.processDefaultResult);
  }

  public GetOwnerReportAccess = (req: Request, res: Response) => {
    req.checkParams("id").isNumeric();

    const errors = req.validationErrors();
    if (errors) {
      return res.json(OwnerErrorsProvider.GetErrorDetails(EOwnerErrors.InvalidOwnerId, errors));
    }

    const ownerId = req.params["id"];

    this.dataAccess.GetOwnerReportAccess(ownerId, res, this.processDefaultResult);
  }
}
