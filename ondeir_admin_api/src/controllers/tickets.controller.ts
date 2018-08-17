import { Request, Response } from "express";
import * as cloudinary from 'cloudinary';

import { Utils } from '../../../ondeir_admin_shared/utils/Utils';
import { BaseController } from './base.controller';
import { ServiceResult } from '../../../ondeir_admin_shared/models/base/serviceResult.model';
import { SystemEntity } from '../../../ondeir_admin_shared/models/admin/system.model';
import { TicketsDAO } from '../dataaccess/tickets/ticketsDAO';
import { EventEntity } from '../../../ondeir_admin_shared/models/tickets/event.model';
import { SectorEntity } from '../../../ondeir_admin_shared/models/tickets/sector.model';
import { TicketSaleEntity } from '../../../ondeir_admin_shared/models/tickets/ticketSale.model';
import { TicketTypeEntity } from '../../../ondeir_admin_shared/models/tickets/ticketType.model';
import { EventPhotoEntity } from '../../../ondeir_admin_shared/models/tickets/eventPhotos.model';
import { TicketsErrorsProvider, ETicketsErrors } from '../config/errors/tickets.errors';
import { json } from "body-parser";
import { BuyerInfoEntity } from "../../../ondeir_admin_shared/models/tickets/buyerInfo.model";
import { CardTransactionEntity } from "../../../ondeir_admin_shared/models/tickets/cardTransaction.model";
import { VoucherEntity } from "../../../ondeir_admin_shared/models/tickets/voucher.model";

export class TicketsController extends BaseController {
    
    private dataAccess: TicketsDAO = new TicketsDAO();

    // Metodos de manipulação de Eventos
    public ListEventsAll = (req: Request, res: Response) => {
        const errors = req.validationErrors();

        if (errors) {
            return res.json(TicketsErrorsProvider.GetErrorDetails(ETicketsErrors.InvalidOwnerId, errors));
        }

        this.dataAccess.Events.ListAllItems(res, this.processDefaultResult);
    }

    public ListEventsByOwner = (req: Request, res: Response) => {
        req.checkParams("owner").isNumeric();

        const errors = req.validationErrors();
        if (errors) {
            return res.json(TicketsErrorsProvider.GetErrorDetails(ETicketsErrors.InvalidOwnerId, errors));
        }

        const ownerId = req.params["owner"];

        this.dataAccess.Events.ListFilteredItems(["OWNER_ID"], [ownerId], res, this.processDefaultResult);
    }

    public ListEventsByCity = (req: Request, res: Response) => {
        req.checkParams("city").isNumeric();

        const errors = req.validationErrors();
        if (errors) {
            return res.json(TicketsErrorsProvider.GetErrorDetails(ETicketsErrors.InvalidOwnerId, errors));
        }

        const cityId = req.params["city"];

        this.dataAccess.ListEventsByCity(cityId, res, this.processDefaultResult);
    }

    public GetEvent = (req: Request, res: Response) => {
        req.checkParams("id").isNumeric();

        const errors = req.validationErrors();
        if (errors) {
            return res.json(TicketsErrorsProvider.GetErrorDetails(ETicketsErrors.InvalidId, errors));
        }

        const id = req.params["id"];

        this.dataAccess.GetEvent(id, res, (res, err, result: SystemEntity) => {
            if (err) { 
                return res.json(ServiceResult.HandlerError(err));
            }

            return res.json(ServiceResult.HandlerSuccessResult(result));            
        } );
    }
    
    public CreateEvent = (req: Request, res: Response) => { 
        // Validação dos dados de entrada
        req.checkBody({
            name: {
                notEmpty: true,
                errorMessage: "Nome do evento é Obrigatório"
            },
            date: {
                notEmpty: true,
                errorMessage: "Data e hora do evento é obrigatório"
            },
            ownerId: {
                isNumeric: true,
                errorMessage: "Código de cliente inválido"
            }
        });

        // Verifica se a entidade tem erros
        const errors = req.validationErrors();
        if (errors) {
            return res.json(TicketsErrorsProvider.GetErrorDetails(ETicketsErrors.InvalidRequiredParams, errors));
        }

        let event: EventEntity = EventEntity.GetInstance();
        event.Map(req.body);

        this.dataAccess.Events.CreateItem(event, res, (res, err, result) => { 
            if (err) { 
                return res.json(TicketsErrorsProvider.GetErrorDetails(ETicketsErrors.ErrorCreateEvent, err));
            }
            
            return res.json(ServiceResult.HandlerSuccessResult(result.insertId));
        });
    }

    public UpdateEvent = (req: Request, res: Response) => { 
        // Validação dos dados de entrada
        req.checkBody({
            id: {
                isNumeric: true,
                errorMessage: "Código do evento inválido"
            },
            name: {
                notEmpty: true,
                errorMessage: "Nome do evento é Obrigatório"
            },
            date: {
                notEmpty: true,
                errorMessage: "Data e hora do evento é obrigatório"
            },
            ownerId: {
                isNumeric: true,
                errorMessage: "Código de cliente inválido"
            }
        });

        // Verifica se a entidade tem erros
        const errors = req.validationErrors();
        if (errors) {
            return res.json(TicketsErrorsProvider.GetErrorDetails(ETicketsErrors.InvalidRequiredParams, errors));
        }

        let event: EventEntity = EventEntity.GetInstance();
        event.Map(req.body);

        this.dataAccess.Events.UpdateItem(event, [event.id.toString()], res, (r,e,i) => {
            if (e) {
                return res.json(ServiceResult.HandlerError(e));                    
            }

            return res.json(ServiceResult.HandlerSuccessResult(event.id));
        });
    }

    public DeleteEvent = (req: Request, res: Response) => { 
        req.checkParams("id").isNumeric();

        const errors = req.validationErrors();
        if (errors) {
            return res.json(TicketsErrorsProvider.GetErrorDetails(ETicketsErrors.InvalidId, errors));
        }

        const id = req.params["id"];

        this.dataAccess.Events.DeleteItem([id], res, (res, err, result) => { 
            if (err) { 
                return res.json(ServiceResult.HandlerError(err));
            }

            return res.json(ServiceResult.HandlerSucess());
        });
    }

    public UploadEventPhotos = (req: Request, res: Response) => {
        req.checkBody({
            photos: {
                exists: true,
                errorMessage: "Imagens do Evento são Obrigatórias"
            }
        });

        const errors = req.validationErrors();
        if (errors) {
            return res.json(TicketsErrorsProvider.GetErrorDetails(ETicketsErrors.InvalidRequiredParams, errors));
        }

        cloudinary.config({ 
            cloud_name: 'ondeirfidelidade', 
            api_key: process.env.CLOUDNARY_KEY, 
            api_secret: process.env.CLOUDNARY_SECRET  
          });

        let uploadedImages = 0;
        
        this.dataAccess.ClearEventPhotos(req.body.photos[0].eventId, (errors, ok) => {
            if (errors) {
                return res.json(ServiceResult.HandlerError(errors));
            }

            req.body.photos.forEach(element => {
                let img: EventPhotoEntity = EventPhotoEntity.GetInstance();
                img.Map(element);
    
                if (!element.id || element.id === 0) {
                    uploadedImages += 1;

                    cloudinary.uploader.upload(element.image, (ret) => {
                        if (ret) {
                            img.image = ret.url.replace("/image/upload", "/image/upload/t_fidelidadeimages").replace(".png", ".jpg").replace("http", "https");

                            this.dataAccess.EventPhotos.CreateItem(img, res, (r, e, i) => {
                                if (!e) {
                                    img.id = i.insertId;
                                } else {
                                    img.id = -1;
                                }
                            });
                        } else {
                            img.id = -1;
                        }

                        if (uploadedImages === req.body.photos.length) {
                            return res.json(ServiceResult.HandlerSucess());
                        }
                    });
                } else {
                    this.dataAccess.EventPhotos.CreateItem(img, res, (r, e, i) => {
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

    public GetEventPhotos = (req: Request, res: Response) => {
        req.checkParams("id").isNumeric();

        const errors = req.validationErrors();
        if (errors) {
            return res.json(TicketsErrorsProvider.GetErrorDetails(ETicketsErrors.InvalidId, errors));
        }

        const id = req.params["id"];

        this.dataAccess.EventPhotos.ListFilteredItems(["EVENT_ID"], [id], res, this.processDefaultResult);
    }

    // Metodos de manipulação de Setores
    public ListSector = (req: Request, res: Response) => {
        req.checkParams("event").isNumeric();

        const errors = req.validationErrors();
        if (errors) {
            return res.json(TicketsErrorsProvider.GetErrorDetails(ETicketsErrors.InvalidEventId, errors));
        }

        const eventId = req.params["event"];

        this.dataAccess.ListSector(eventId, res, this.processDefaultResult);
    }

    public GetSector = (req: Request, res: Response) => {
        req.checkParams("id").isNumeric();

        const errors = req.validationErrors();
        if (errors) {
            return res.json(TicketsErrorsProvider.GetErrorDetails(ETicketsErrors.InvalidId, errors));
        }

        const id = req.params["id"];        

        this.dataAccess.GetSector(id, res, (res, err, result: SystemEntity) => {
            if (err) { 
                return res.json(ServiceResult.HandlerError(err));
            } else if(!result) {
                return res.json(TicketsErrorsProvider.GetErrorDetails(ETicketsErrors.InvalidId, errors));
            }

            return res.json(ServiceResult.HandlerSuccessResult(result));            
        } );
    }
    
    public CreateSector = (req: Request, res: Response) => { 
        // Validação dos dados de entrada
        req.checkBody({
            name: {
                notEmpty: true,
                errorMessage: "Nome do setor é Obrigatório"
            },
            eventId: {
                isNumeric: true,
                errorMessage: "Código do evento inválido"
            }
        });

        // Verifica se a entidade tem erros
        const errors = req.validationErrors();
        if (errors) {
            return res.json(TicketsErrorsProvider.GetErrorDetails(ETicketsErrors.InvalidRequiredParams, errors));
        }

        let sector: SectorEntity = SectorEntity.GetInstance();
        sector.Map(req.body);

        this.dataAccess.Sectors.CreateItem(sector, res, (res, err, result) => { 
            if (err) {
                if (err.sqlMessage.indexOf('FK_FK_EVENT_SECTOR') >= 0) {
                    return res.json(TicketsErrorsProvider.GetError(ETicketsErrors.EventNotFound));
                } else {
                    return res.json(ServiceResult.HandlerError(err));
                }
            }

            return res.json(ServiceResult.HandlerSuccessResult(result.insertId));
        });
    }

    public UpdateSector = (req: Request, res: Response) => { 
        // Validação dos dados de entrada
        req.checkBody({
            id: {
                isNumeric: true,
                errorMessage: "Código do evento inválido"
            },
            name: {
                notEmpty: true,
                errorMessage: "Nome do evento é Obrigatório"
            },
            eventId: {
                isNumeric: true,
                errorMessage: "Código do evento inválido"
            }
        });

        // Verifica se a entidade tem erros
        const errors = req.validationErrors();
        if (errors) {
            return res.json(TicketsErrorsProvider.GetErrorDetails(ETicketsErrors.InvalidRequiredParams, errors));
        }

        let sector: SectorEntity = SectorEntity.GetInstance();
        sector.Map(req.body);

        this.dataAccess.Sectors.UpdateItem(sector, [sector.id.toString()],res, (res, err, result) => { 
            if (err) {
                if (err.sqlMessage.indexOf('FK_FK_EVENT_SECTOR') >= 0) {
                    return res.json(TicketsErrorsProvider.GetError(ETicketsErrors.EventNotFound));
                } else {
                    return res.json(ServiceResult.HandlerError(err));
                }
            }
            
            return res.json(ServiceResult.HandlerSucess());
        });
    }

    public DeleteSector = (req: Request, res: Response) => { 
        req.checkParams("id").isNumeric();

        const errors = req.validationErrors();
        if (errors) {
            return res.json(TicketsErrorsProvider.GetErrorDetails(ETicketsErrors.InvalidId, errors));
        }

        const id = req.params["id"];

        this.dataAccess.Sectors.DeleteItem([id], res, (res, err, result) => { 
            if (err) { 
                return res.json(ServiceResult.HandlerError(err));
            }

            return res.json(ServiceResult.HandlerSucess());
        });
    }

    // Metodos de manipulação de tipos de ingressos
    public ListTicketsTypeBySector = (req: Request, res: Response) => {
        req.checkParams("sector").isNumeric();

        const errors = req.validationErrors();
        if (errors) {
            return res.json(TicketsErrorsProvider.GetErrorDetails(ETicketsErrors.InvalidEventId, errors));
        }

        const sectorId = req.params["sector"];

        this.dataAccess.ListTicketsTypeBySector(sectorId, res, this.processDefaultResult);
    }

    public ListTicketsTypeByEvent = (req: Request, res: Response) => {
        req.checkParams("event").isNumeric();

        const errors = req.validationErrors();
        if (errors) {
            return res.json(TicketsErrorsProvider.GetErrorDetails(ETicketsErrors.InvalidEventId, errors));
        }

        const eventId = req.params["event"];

        this.dataAccess.ListTicketsTypeByEvent(eventId, res, this.processDefaultResult);
    }

    public GetTicketsType = (req: Request, res: Response) => {
        req.checkParams("id").isNumeric();

        const errors = req.validationErrors();
        if (errors) {
            return res.json(TicketsErrorsProvider.GetErrorDetails(ETicketsErrors.InvalidId, errors));
        }

        const id = req.params["id"];        

        this.dataAccess.GetTicketsType(id, res, (res, err, result: SystemEntity) => {
            if (err) { 
                return res.json(ServiceResult.HandlerError(err));
            }

            return res.json(ServiceResult.HandlerSuccessResult(result));            
        } );
    }
    
    public CreateTicketsType = (req: Request, res: Response) => { 
        // Validação dos dados de entrada
        req.checkBody({
            name: {
                notEmpty: true,
                errorMessage: "Nome do setor é Obrigatório"
            },
            sectorId: {
                isNumeric: true,
                errorMessage: "Código do setor inválido"
            },
            value: {
                notEmpty: true,
                errorMessage: "Valor do ingresso é Obrigatório"
            },
            tax: {
                notEmpty: true,
                errorMessage: "A taxa cobrada é Obrigatória"
            },
            total: {
                notEmpty: true,
                errorMessage: "Valor total do ingresso é Obrigatório"
            },
            amount: {
                notEmpty: true,
                errorMessage: "Quantidade de ingressos é Obrigatório"
            }
        });

        // Verifica se a entidade tem erros
        const errors = req.validationErrors();
        if (errors) {
            return res.json(TicketsErrorsProvider.GetErrorDetails(ETicketsErrors.InvalidRequiredParams, errors));
        }

        let ticketsType: TicketTypeEntity = TicketTypeEntity.GetInstance();
        ticketsType.Map(req.body);

        this.dataAccess.TicketTypes.CreateItem(ticketsType, res, (res, err, result) => { 
            if (err) {
                if (err.sqlMessage.indexOf('FK_FK_TICKETS_SECTOR') >= 0) {
                    return res.json(TicketsErrorsProvider.GetError(ETicketsErrors.TicketNotFound));
                } else {
                    return res.json(ServiceResult.HandlerError(err));
                }
            }
            
            return res.json(ServiceResult.HandlerSuccessResult(result.insertId));
        });
    }

    public UpdateTicketsType = (req: Request, res: Response) => { 
        // Validação dos dados de entrada
        req.checkBody({
            name: {
                notEmpty: true,
                errorMessage: "Nome do setor é Obrigatório"
            },
            sectorId: {
                isNumeric: true,
                errorMessage: "Código do setor inválido"
            },
            value: {
                notEmpty: true,
                errorMessage: "Valor do ingresso é Obrigatório"
            },
            tax: {
                notEmpty: true,
                errorMessage: "A taxa cobrada é Obrigatória"
            },
            total: {
                notEmpty: true,
                errorMessage: "Valor total do ingresso é Obrigatório"
            },
            amount: {
                notEmpty: true,
                errorMessage: "Quantidade de ingressos é Obrigatório"
            }
        });

        // Verifica se a entidade tem erros
        const errors = req.validationErrors();
        if (errors) {
            return res.json(TicketsErrorsProvider.GetErrorDetails(ETicketsErrors.InvalidRequiredParams, errors));
        }

        let ticketsType: TicketTypeEntity = TicketTypeEntity.GetInstance();
        ticketsType.Map(req.body);

        this.dataAccess.TicketTypes.UpdateItem(ticketsType, [ticketsType.id.toString()],res, (res, err, result) => { 
            if (err) {
                if (err.sqlMessage.indexOf('FK_FK_EVENT_SECTOR') >= 0) {
                    return res.json(TicketsErrorsProvider.GetError(ETicketsErrors.EventNotFound));
                } else {
                    return res.json(ServiceResult.HandlerError(err));
                }
            }
            
            res.json(ServiceResult.HandlerSucess());
        });
    }

    public DeleteTicketsType = (req: Request, res: Response) => { 
        req.checkParams("id").isNumeric();

        const errors = req.validationErrors();
        if (errors) {
            return res.json(TicketsErrorsProvider.GetErrorDetails(ETicketsErrors.InvalidId, errors));
        }

        const id = req.params["id"];

        this.dataAccess.TicketTypes.DeleteItem([id], res, (res, err, result) => { 
            if (err) { 
                return res.json(ServiceResult.HandlerError(err));
            }

            return res.json(ServiceResult.HandlerSucess());
        });
    }

    public ListTicketSales = (req: Request, res: Response) => {

        this.dataAccess.TicketSales.ListAllItems(res, this.processDefaultResult);
    }

    public ListTicketSalesByOwner = (req: Request, res: Response) => {

        req.checkParams("ownerId").isNumeric();

        const errors = req.validationErrors();
        if (errors) {
            return res.json(TicketsErrorsProvider.GetErrorDetails(ETicketsErrors.InvalidId, errors));
        }

        const ownerId = req.params["ownerId"];

        this.dataAccess.TicketSales.ListFilteredItems(["OWNER_ID"], [ownerId], res, this.processDefaultResult);
    }

    public GetTicketSales = (req: Request, res: Response) => {
        req.checkParams("id").isNumeric();

        const errors = req.validationErrors();
        if (errors) {
            return res.json(TicketsErrorsProvider.GetErrorDetails(ETicketsErrors.InvalidId, errors));
        }

        const id = req.params["id"];        

        this.dataAccess.GetTicketsSale(id, res, (res, err, result: SystemEntity) => {
            if (err) { 
                return res.json(ServiceResult.HandlerError(err));
            }

            return res.json(ServiceResult.HandlerSuccessResult(result));            
        } );
    }
    
    public CreateTicketSales = (req: Request, res: Response) => { 
        // Validação dos dados de entrada
        req.checkBody({
            eventId: {
                notEmpty: true,
                errorMessage: "Dados do evento inválido"
            },
            buyerInfo: {
                exists: true,
                errorMessage: "Dados do comprador inválido"
            },
            cardTransaction: {
                exists: true,
                errorMessage: "Dados do pagamento inválido"
            },
            vouchers: {
                exists: true,
                errorMessage: "Os itens da compra são Obrigatórios"
            }
        });

        // Verifica se a entidade tem erros
        const errors = req.validationErrors();
        if (errors) {
            return res.json(TicketsErrorsProvider.GetErrorDetails(ETicketsErrors.InvalidRequiredParams, errors));
        }

        let ticketSales: TicketSaleEntity = TicketSaleEntity.GetInstance();
        ticketSales.Map(req.body);
        // Mapeando info comprador
        ticketSales.buyerInfo = BuyerInfoEntity.GetInstance();
        ticketSales.buyerInfo.Map(req.body.buyerInfo);
        // Mapeando info comprador
        ticketSales.cardTransaction = CardTransactionEntity.GetInstance();
        ticketSales.cardTransaction.Map(req.body.cardTransaction);
        // Mapeando vouchers comprados
        let vouchers: Array<VoucherEntity>;
        vouchers = req.body.vouchers.map(item => {
            let voucherItem = new VoucherEntity();
            voucherItem.ticketTypeId = item.ticketTypeId;
            voucherItem.amount = item.amount;

            return voucherItem;
        });

        ticketSales.vouchers = vouchers;
        ticketSales.date = new Date();

        // Verificar o estoque de ingressos
        this.dataAccess.ListTicketsTypeIn(this.GetTypesIn(ticketSales.vouchers), res, (res, err, result: Array<TicketTypeEntity>) => {
            if (err) { 
                return res.json(ServiceResult.HandlerError(err));

            } else if(!result || result.length == 0) {
                return res.json(TicketsErrorsProvider.GetErrorDetails(ETicketsErrors.InvalidId, errors));

            } else {
                let hasAvaliable: boolean = true;
                let detailsAvaliable = new Array<any>(); 
                ticketSales.total = 0;
                ticketSales.totalTax = 0;
                ticketSales.amount = 0;

                ticketSales.vouchers.forEach(voucher => {

                    voucher.ticketType = this.CheckAvaliable(voucher, result);

                    if(voucher.ticketType.available == 0 || voucher.ticketType.available < voucher.amount) {
                        detailsAvaliable.push(voucher.ticketType.name + '= Disponível ' + voucher.ticketType.available); 
                        hasAvaliable = false;
                    } else {
                        ticketSales.total += voucher.ticketType.total * voucher.amount;
                        ticketSales.totalTax += (voucher.ticketType.value * (voucher.ticketType.tax / 100)) * voucher.amount;
                        ticketSales.amount += voucher.amount;
                    }
                });
                
                if(!hasAvaliable) {
                    return res.json(TicketsErrorsProvider.GetErrorDetails(ETicketsErrors.TicketNotAvailable, detailsAvaliable));
                
                } else {
                    // Inserir os dados do cliente que esta realizando a compra
                    this.CreateBuyerInfo(ticketSales.buyerInfo, res, (res, err, result) => {
                        if (err) { 
                            if (err.sqlMessage.indexOf('FK_FK_BUYER_USER') >= 0) {
                                return res.json(TicketsErrorsProvider.GetError(ETicketsErrors.UserNotFound));
                            }

                            return res.json(ServiceResult.HandlerError(err));
                        }

                        ticketSales.buyerInfoId = ticketSales.buyerInfo.userId;
                        ticketSales.cardTransaction.total = ticketSales.total;

                        // Incluir dados do pagamento
                        this.dataAccess.CardTransactions.CreateItem(ticketSales.cardTransaction, res, (res, err, result) => { 
                            if (err) { 
                                return res.json(ServiceResult.HandlerError(err));
                            }
                            
                            ticketSales.transactionId = result.insertId;

                            // Incluir a venda
                            this.dataAccess.TicketSales.CreateItem(ticketSales, res, (res, err, result) => { 
                                if (err) {
                                    if (err.sqlMessage.indexOf('FK_FK_TICKET_SALE') >= 0) {
                                        return res.json(TicketsErrorsProvider.GetError(ETicketsErrors.TicketNotFound));
                                    } else if (err.sqlMessage.indexOf('FK_FK_BUYER_INFO') >= 0) {
                                        return res.json(TicketsErrorsProvider.GetError(ETicketsErrors.UserNotFound));
                                    } else if (err.sqlMessage.indexOf('FK_FK_TICKET_TRANSACTION') >= 0) {
                                        return res.json(TicketsErrorsProvider.GetError(ETicketsErrors.TransactionNotFound));
                                    } else {
                                        return res.json(ServiceResult.HandlerError(err));
                                    }
                                }

                                ticketSales.id = result.insertId;

                                // Inserir Voucher
                                ticketSales.vouchers.forEach(voucher => {

                                    // Atualizar estoque de ingressos
                                    this.dataAccess.SoldTicketType(1, voucher.amount, voucher.ticketType.sectorId, voucher.ticketTypeId, res, (res, err, result) => { 
                                        if (err) {
                                            // TODO: Gravar log de execução assincrona 
                                            console.log(ServiceResult.HandlerError(err));
                                        }
                                    });

                                    for (let index = 0; index < voucher.amount; index++) {
                                        
                                        voucher.qrHash = Utils.uuidv4();
                                        voucher.value = voucher.ticketType.total;
                                        voucher.userId = ticketSales.buyerInfo.userId;
                                        voucher.ticketSaleId = ticketSales.id;

                                        this.dataAccess.Vouchers.CreateItem(voucher, res, (res, err, result) => { 
                                            if (err) {
                                                // TODO: Gravar log de execução assincrona 
                                                console.log(ServiceResult.HandlerError(err));
                                            }
                                        });
                                    }
                                });

                                res.json(ServiceResult.HandlerSucess());
                            });
                        });
                    });
                }
            }
        });
    }

    private GetTypesIn = (vouchers: Array<VoucherEntity>) => {
        let result: string = "";
        
        if(vouchers && vouchers.length > 0) {
            vouchers.forEach(element => {
                result += element.ticketTypeId + ","; 
            });

            result = result.substring(0,result.length - 1);
        }

        return result
    }

    private CheckAvaliable = (voucher: VoucherEntity, ticketsTypes: Array<TicketTypeEntity>) => {
        var result: TicketTypeEntity = TicketTypeEntity.GetInstance();

        ticketsTypes.forEach(item => {
            if(voucher.ticketTypeId == item.id) {
                result = item;
            } 
        });

        return result;
    }

    private CreateBuyerInfo = (buyerInfo: BuyerInfoEntity, res, callback) => {

        this.dataAccess.BuyersInfo.GetItem([buyerInfo.userId.toString()], res, (res, err, result) => {
            if(!result) {    
                this.dataAccess.BuyersInfo.CreateItem(buyerInfo, res, (res, err, result) => {
                    
                    return callback(res, err, result.insertId);
                });
            }

            return callback(res, err, buyerInfo.userId);
        });
    }

    public UpdateTicketSales = (req: Request, res: Response) => { 
        // Validação dos dados de entrada
        req.checkBody({
            buyerInfo: {
                exists: true,
                errorMessage: "Dados do comprador inválido"
            },
            cardTransaction: {
                exists: true,
                errorMessage: "Dados do pagamento inválido"
            },
            vouchers: {
                exists: true,
                errorMessage: "Os itens da compra são Obrigatórios"
            },
            date: {
                notEmpty: true,
                errorMessage: "Data da compra é Obrigatória"
            },
            total: {
                notEmpty: true,
                errorMessage: "Valor total da compra é Obrigatória"
            }
        });

        // Verifica se a entidade tem erros
        const errors = req.validationErrors();
        if (errors) {
            return res.json(TicketsErrorsProvider.GetErrorDetails(ETicketsErrors.InvalidRequiredParams, errors));
        }

        let ticketSales: TicketSaleEntity = TicketSaleEntity.GetInstance();
        ticketSales.Map(req.body);

        this.dataAccess.TicketSales.UpdateItem(ticketSales, [ticketSales.id.toString()],res, (res, err, result) => { 
            if (err) {
                if (err.sqlMessage.indexOf('FK_FK_TICKET_SALE') >= 0) {
                    return res.json(TicketsErrorsProvider.GetError(ETicketsErrors.EventNotFound));
                } else {
                    return res.json(ServiceResult.HandlerError(err));
                }
            }
            
            res.json(ServiceResult.HandlerSucess());
        });
    }

    public DeleteTicketSales = (req: Request, res: Response) => { 
        req.checkParams("id").isNumeric();

        const errors = req.validationErrors();
        if (errors) {
            return res.json(TicketsErrorsProvider.GetErrorDetails(ETicketsErrors.InvalidId, errors));
        }

        const id = req.params["id"];

        // Verifica o limite de antecedencia para cancelar uma venda
        this.dataAccess.TicketSales.GetItem([id], res, (res, err, result: TicketSaleEntity) => {
            if (err) { 
                return res.json(TicketsErrorsProvider.GetErrorDetails(ETicketsErrors.TicketSaleNotFound, errors));
            }

            this.dataAccess.Events.GetItem([result.eventId.toString()], res, (res, err, result: EventEntity) => {
                if (err) { 
                    return res.json(TicketsErrorsProvider.GetErrorDetails(ETicketsErrors.EventNotFound, errors));
                }

                // Até no máximo 1 dia antes
                var today = new Date();
                var limit = result.date;
                var dayOfMonth = limit.getDate();
                limit.setDate(dayOfMonth - 1);

                if(today > limit) {
                    return res.json(TicketsErrorsProvider.GetErrorDetails(ETicketsErrors.TicketSaleDeleteError, errors));
                } else {
                    // Cancelar uma venda
                    this.dataAccess.CancelTicketSale(id, res, (res, err, result) => {
                        if (err) { 
                            return res.json(ServiceResult.HandlerError(err));
                        }

                        return res.json(ServiceResult.HandlerSucess()); 
                    });
                }
            });
        });
    }

    public CheckStock = (req: Request, res: Response) => {
        req.checkBody({
            ticketTypeId: {
                isNumeric: true,
                errorMessage: "Código do setor inválido"
            },
            amount: {
                isNumeric: true,
                errorMessage: "Quantidade de ingressos inválido"
            }
        });

        // Verifica se a entidade tem erros
        const errors = req.validationErrors();
        if (errors) {
            return res.json(TicketsErrorsProvider.GetErrorDetails(ETicketsErrors.InvalidRequiredParams, errors));
        }

        const ticketTypeId = req.params["ticketTypeId"];
        const amount = req.params["amount"];

        this.dataAccess.GetTicketsType(ticketTypeId, res, (res, err, result: TicketTypeEntity) => {
            if (err) { 
                return res.json(ServiceResult.HandlerError(err));

            } else if(!result || !result.id) {
                return res.json(TicketsErrorsProvider.GetErrorDetails(ETicketsErrors.InvalidId, errors));

            } else if(result.available <= amount) {
                return res.json(TicketsErrorsProvider.GetErrorDetails(ETicketsErrors.TicketNotAvailable, errors));
            }

            return res.json(ServiceResult.HandlerSucess());
        });

    }

    // Metodos de manipulação de Eventos
    public ListCardTransation = (req: Request, res: Response) => {

        this.dataAccess.CardTransactions.ListAllItems(res, this.processDefaultResult);
    }

    public GetCardTransation = (req: Request, res: Response) => {
        req.checkParams("id").isNumeric();

        const errors = req.validationErrors();
        if (errors) {
            return res.json(TicketsErrorsProvider.GetErrorDetails(ETicketsErrors.InvalidId, errors));
        }

        const id = req.params["id"];        

        this.dataAccess.CardTransactions.GetItem([id], res, (res, err, result: SystemEntity) => {
            if (err) { 
                return res.json(ServiceResult.HandlerError(err));
            }

            return res.json(ServiceResult.HandlerSuccessResult(result));            
        } );
    }
    
    public CreateCardTransation = (req: Request, res: Response) => { 
        // Validação dos dados de entrada
        req.checkBody({
            status: {
                notEmpty: true,
                errorMessage: "A situação do pagamento é obrigatório"
            },
            dateTime: {
                notEmpty: true,
                errorMessage: "Data e hora do pagamento é obrigatório"
            },
            identifier: {
                notEmpty: true,
                errorMessage: "Código de identificador de pagamento obrigatório"
            }
        });

        // Verifica se a entidade tem erros
        const errors = req.validationErrors();
        if (errors) {
            return res.json(TicketsErrorsProvider.GetErrorDetails(ETicketsErrors.InvalidRequiredParams, errors));
        }

        let card: CardTransactionEntity = CardTransactionEntity.GetInstance();
        card.Map(req.body);

        this.dataAccess.CardTransactions.CreateItem(card, res, (res, err, result) => { 
            if (err) { 
                return res.json(ServiceResult.HandlerError(err));
            }
            
            return res.json(ServiceResult.HandlerSuccessResult(result.insertId));
        });
    }

    public UpdateCardTransation = (req: Request, res: Response) => { 
        // Validação dos dados de entrada
        req.checkBody({
            status: {
                notEmpty: true,
                errorMessage: "A situação do pagamento é obrigatório"
            },
            dateTime: {
                notEmpty: true,
                errorMessage: "Data e hora do pagamento é obrigatório"
            },
            identifier: {
                notEmpty: true,
                errorMessage: "Código de identificador de pagamento obrigatório"
            }
        });

        // Verifica se a entidade tem erros
        const errors = req.validationErrors();
        if (errors) {
            return res.json(TicketsErrorsProvider.GetErrorDetails(ETicketsErrors.InvalidRequiredParams, errors));
        }

        let card: CardTransactionEntity = CardTransactionEntity.GetInstance();
        card.Map(req.body);

        this.dataAccess.CardTransactions.UpdateItem(card, [card.id.toString()],res, this.processDefaultResult);
    }

    public DeleteCardTransaction = (req: Request, res: Response) => { 
        req.checkParams("id").isNumeric();

        const errors = req.validationErrors();
        if (errors) {
            return res.json(TicketsErrorsProvider.GetErrorDetails(ETicketsErrors.InvalidId, errors));
        }

        const id = req.params["id"];

        this.dataAccess.CardTransactions.DeleteItem([id], res, (res, err, result) => { 
            if (err) { 
                return res.json(ServiceResult.HandlerError(err));
            }

            return res.json(ServiceResult.HandlerSucess());
        });
    }

    public ListVouchersByUserId = (req: Request, res: Response) => {
        req.checkParams("userId").isNumeric();

        const errors = req.validationErrors();
        if (errors) {
            return res.json(TicketsErrorsProvider.GetErrorDetails(ETicketsErrors.InvalidId, errors));
        }

        const userId = req.params["userId"];

        this.dataAccess.ListVouchersByUserId(userId, res, this.processDefaultResult);
    }

    public GetAnnouncementEvent = (req: Request, res: Response) => {
        req.checkParams("eventId").isNumeric();

        const errors = req.validationErrors();
        if (errors) {
            return res.json(TicketsErrorsProvider.GetErrorDetails(ETicketsErrors.InvalidId, errors));
        }

        const id = req.params["eventId"];
        
        let event: EventEntity = EventEntity.GetInstance();

        this.dataAccess.GetAnnouncementEvent(id, res, (res, err, result: SystemEntity) => {
            if (err) { 
                return res.json(ServiceResult.HandlerError(err));
            }

            return res.json(ServiceResult.HandlerSuccessResult(result));            
        });
    }

    public ListEventsSales = (req: Request, res: Response) => {

        req.checkParams("ownerId").isNumeric();

        const errors = req.validationErrors();
        if (errors) {
            return res.json(TicketsErrorsProvider.GetErrorDetails(ETicketsErrors.InvalidId, errors));
        }

        const ownerId = req.params["ownerId"];

        this.dataAccess.ListEventsSales(ownerId, res, this.processDefaultResult);
    }

    public ListEventsSalesDetail = (req: Request, res: Response) => {

        req.checkParams("eventId").isNumeric();

        const errors = req.validationErrors();
        if (errors) {
            return res.json(TicketsErrorsProvider.GetErrorDetails(ETicketsErrors.InvalidId, errors));
        }

        const eventId = req.params["eventId"];

        this.dataAccess.ListEventsSalesDetail(eventId, res, this.processDefaultResult);
    }

    public ListEventsSalesTicket = (req: Request, res: Response) => {

        req.checkParams("action").isNumeric();
        req.checkParams("id").isNumeric();

        const errors = req.validationErrors();
        if (errors) {
            return res.json(TicketsErrorsProvider.GetErrorDetails(ETicketsErrors.InvalidId, errors));
        }

        const action = req.params["action"];
        const id = req.params["id"];

        this.dataAccess.ListEventsSalesTicket(action, id, res, this.processDefaultResult);
    }

    public GetEventSaleSummary = (req: Request, res: Response) => {
        req.checkParams("id").isNumeric();

        const errors = req.validationErrors();
        if (errors) {
            return res.json(TicketsErrorsProvider.GetErrorDetails(ETicketsErrors.InvalidId, errors));
        }

        const id = req.params["id"];        

        this.dataAccess.GetEventSaleSummary(id, res, (res, err, result: SystemEntity) => {
            if (err) { 
                return res.json(ServiceResult.HandlerError(err));
            }

            return res.json(ServiceResult.HandlerSuccessResult(result));            
        } );
    }

    public GetBuyerInfo = (req: Request, res: Response) => {

        req.checkParams("userId").isNumeric();

        const errors = req.validationErrors();
        if (errors) {
            return res.json(TicketsErrorsProvider.GetErrorDetails(ETicketsErrors.InvalidId, errors));
        }

        const userId = req.params["userId"];

        this.dataAccess.GetBuyerInfo(userId, res, this.processDefaultResult);
    }

    public GetVoucher = (req: Request, res: Response) => {
        req.checkParams("id").isNumeric();

        const errors = req.validationErrors();
        if (errors) {
            return res.json(TicketsErrorsProvider.GetErrorDetails(ETicketsErrors.InvalidId, errors));
        }

        const id = req.params["id"];

        this.dataAccess.GetVoucher(id, res, (res, err, result: SystemEntity) => {
            if (err) { 
                return res.json(ServiceResult.HandlerError(err));
            }

            return res.json(ServiceResult.HandlerSuccessResult(result));            
        } );
    }
}