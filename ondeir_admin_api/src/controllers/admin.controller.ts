import { Request, Response } from "express";
import * as cloudinary from 'cloudinary';

import { BaseController } from './base.controller';
import { AdminDAO } from '../dataaccess/admin/adminDAO';
import { ServiceResult } from '../../../ondeir_admin_shared/models/base/serviceResult.model';
import { SystemEntity } from '../../../ondeir_admin_shared/models/admin/system.model';
import { AdminErrorsProvider, EAdminErrors } from '../config/errors/admin.errors';

export class AdminController extends BaseController {
    private dataAccess: AdminDAO = new AdminDAO();

    // Metodos de manupulação de Telas do sistema
    public ListScreens = (req: Request, res: Response) => {
        this.dataAccess.Screens.ListAllItems(res, this.processDefaultResult);
    }

    public ListScreensTree = (req: Request, res: Response) => {
        this.dataAccess.Screens.ListAllItems(res, (res, err, screens: Array<SystemEntity>) => {
            if (err) { 
                return res.json(ServiceResult.HandlerError(err));
            }

            const result: Array<SystemEntity> = screens.filter(x=> x.parentId === null);
            result.forEach(item => {    
                item.children = screens.filter(x => x.parentId === item.id);
            });

            return res.json(ServiceResult.HandlerSuccessResult(result));
        });
    }

    public GetScreens = (req: Request, res: Response) => {
        req.checkParams("id").isNumeric();

        const errors = req.validationErrors();
        if (errors) {
            return res.json(AdminErrorsProvider.GetErrorDetails(EAdminErrors.InvalidId, errors));
        }

        const id = req.params["id"];        

        this.dataAccess.Screens.GetItem([id], res, (res, err, result: SystemEntity) => {
            if (err) { 
                return res.json(ServiceResult.HandlerError(err));
            }

            return res.json(ServiceResult.HandlerSuccessResult(result));

            // this.dataAccess.Screens.ListFilteredItems(["PARENT_ID"], [result.id.toString()], res, (res, error, ret) => {
            //     if (error) { 
            //         return res.json(ServiceResult.HandlerError(err));
            //     }

            //     result.children = ret;

            //     return res.json(ServiceResult.HandlerSuccessResult(result));
            // });
        } );
    }

    public CreateScreen = (req: Request, res: Response) => {
        // Validação dos dados de entrada
        req.checkBody({
            name: {
                notEmpty: true,
                errorMessage: "Nome da tela é obrigatório"
            },
            menuTitle: {
                notEmpty: true,
                errorMessage: "Título da tela é obrigatório"
            },
            menuLink: {
                notEmpty: true,
                errorMessage: "Caminho de acesso da tela é obrigatório"
            },
            menuLogo: {
                notEmpty: true,
                errorMessage: "Ícone da tela é obrigatório"
            },
        });

        // Verifica se a entidade tem erros
        const errors = req.validationErrors();
        if (errors) {
            return res.json(AdminErrorsProvider.GetErrorDetails(EAdminErrors.InvalidRequiredParams, errors));
        }

        let screen: SystemEntity = SystemEntity.GetInstance();
        screen.Map(req.body);

        const imageLogo = screen.logo;
        screen.logo = "";

        this.dataAccess.Screens.CreateItem(screen, res, (res, err, result) => { 
            if (err) { 
                return res.json(ServiceResult.HandlerError(err));
            }

            //Upload imagem
            if (imageLogo && imageLogo.length > 0) {
                cloudinary.config({ 
                  cloud_name: 'ondeirfidelidade', 
                  api_key: process.env.CLOUDNARY_KEY, 
                  api_secret: process.env.CLOUDNARY_SECRET 
                });
      
                cloudinary.uploader.upload(imageLogo, (ret) => {
                  if (ret && !ret.error) {
                    screen.id = result.insertId;
                    screen.logo = ret.url.replace("/image/upload", "/image/upload/t_fidelidadeimages").replace(".png", ".jpg").replace("http", "https");
      
                    return this.dataAccess.Screens.UpdateItem(screen, [screen.id.toString()], res, this.processDefaultResult);
                  } else {
                    return res.json(AdminErrorsProvider.GetError(EAdminErrors.LogoUploadError));
                  }
                });
              } else {
                return res.json(ServiceResult.HandlerSucess());
              }

            //return res.json(ServiceResult.HandlerSucess());
        });
    }

    public UpdateScreen = (req: Request, res: Response) => {
        // Validação dos dados de entrada
        req.checkBody({
            id: {
                isNumeric: true,
                errorMessage: "Id da tela é obrigatório"
            }, 
            name: {
                notEmpty: true,
                errorMessage: "Nome da tela é obrigatório"
            },
            menuTitle: {
                notEmpty: true,
                errorMessage: "Título da tela é obrigatório"
            },
            menuLink: {
                notEmpty: true,
                errorMessage: "Caminho de acesso da tela é obrigatório"
            },
            menuLogo: {
                notEmpty: true,
                errorMessage: "Ícone da tela é obrigatório"
            },
        });

        // Verifica se a entidade tem erros
        const errors = req.validationErrors();
        if (errors) {
            return res.json(AdminErrorsProvider.GetErrorDetails(EAdminErrors.InvalidRequiredParams, errors));
        }

        let screen: SystemEntity = SystemEntity.GetInstance();
        screen.Map(req.body);

        let imageLogo = screen.logo;

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
          if (ret && !ret.error) {
            screen.logo = ret.url.replace("/image/upload", "/image/upload/t_fidelidadeimages").replace(".png", ".jpg").replace("http", "https");

            this.dataAccess.Screens.UpdateItem(screen, [screen.id.toString()], res, (res, err, result) => { 
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
        this.dataAccess.Screens.UpdateItem(screen, [screen.id.toString()],res, this.processDefaultResult);
      }

        
    }

    public DeleteScreen = (req: Request, res: Response) => {
        req.checkParams("id").isNumeric();

        const errors = req.validationErrors();
        if (errors) {
            return res.json(AdminErrorsProvider.GetErrorDetails(EAdminErrors.InvalidId, errors));
        }

        const id = req.params["id"];

        this.dataAccess.Screens.DeleteItem([id], res, (res, err, result) => { 
            if (err) { 
                return res.json(ServiceResult.HandlerError(err));
            }

            return res.json(ServiceResult.HandlerSucess());
        });
    }
}