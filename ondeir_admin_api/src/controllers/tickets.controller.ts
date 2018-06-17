import { Request, Response } from "express";

import { BaseController } from './base.controller';
import { ServiceResult } from '../../../ondeir_admin_shared/models/base/serviceResult.model';
import { SystemEntity } from '../../../ondeir_admin_shared/models/admin/system.model';
import { TicketsDAO } from '../dataaccess/tickets/ticketsDAO';
import { EventEntity } from '../../../ondeir_admin_shared/models/tickets/event.model';
import { SectorEntity } from '../../../ondeir_admin_shared/models/tickets/sector.model';
import { TicketSaleEntity } from '../../../ondeir_admin_shared/models/tickets/ticketSale.model';
import { TicketTypeEntity } from '../../../ondeir_admin_shared/models/tickets/ticketType.model';
import { TicketsErrorsProvider, ETicketsErrors } from '../config/errors/tickets.errors';
import { json } from "body-parser";
import { BuyerInfoEntity } from "../../../ondeir_admin_shared/models/tickets/buyerInfo.model";
import { CardTransactionEntity } from "../../../ondeir_admin_shared/models/tickets/cardTransaction.model";

export class TicketsController extends BaseController {
    
    private dataAccess: TicketsDAO = new TicketsDAO();

    // Metodos de manipulação de Eventos
    public ListEvents = (req: Request, res: Response) => {
        req.checkParams("owner").isNumeric();

        const errors = req.validationErrors();
        if (errors) {
            return res.json(TicketsErrorsProvider.GetErrorDetails(ETicketsErrors.InvalidOwnerId, errors));
        }

        const ownerId = req.params["owner"];

        this.dataAccess.ListEvents(ownerId, res, this.processDefaultResult);
    }

    public GetEvent = (req: Request, res: Response) => {
        req.checkParams("id").isNumeric();

        const errors = req.validationErrors();
        if (errors) {
            return res.json(TicketsErrorsProvider.GetErrorDetails(ETicketsErrors.InvalidId, errors));
        }

        const id = req.params["id"];        

        this.dataAccess.Events.GetItem([id], res, (res, err, result: SystemEntity) => {
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
            dateTime: {
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
                return res.json(ServiceResult.HandlerError(err));
            }
            
            res.json(ServiceResult.HandlerSucess());
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
            dateTime: {
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

        this.dataAccess.Events.UpdateItem(event, [event.id.toString()],res, this.processDefaultResult);
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

        this.dataAccess.Sectors.GetItem([id], res, (res, err, result: SystemEntity) => {
            if (err) { 
                return res.json(ServiceResult.HandlerError(err));
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
            
            res.json(ServiceResult.HandlerSucess());
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
            
            res.json(ServiceResult.HandlerSucess());
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
    public ListTicketsType = (req: Request, res: Response) => {
        req.checkParams("sector").isNumeric();

        const errors = req.validationErrors();
        if (errors) {
            return res.json(TicketsErrorsProvider.GetErrorDetails(ETicketsErrors.InvalidEventId, errors));
        }

        const sectorId = req.params["sector"];

        this.dataAccess.ListTicketsType(sectorId, res, this.processDefaultResult);
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
            
            res.json(ServiceResult.HandlerSucess());
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
        req.checkParams("type").isNumeric();

        const errors = req.validationErrors();
        if (errors) {
            return res.json(TicketsErrorsProvider.GetErrorDetails(ETicketsErrors.InvalidEventId, errors));
        }

        const typeId = req.params["type"];

        this.dataAccess.ListTicketsSale(typeId, res, this.processDefaultResult);
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
            ticketTypeId: {
                isNumeric: true,
                errorMessage: "Código do setor inválido"
            },
            date: {
                notEmpty: true,
                errorMessage: "A data é Obrigatória"
            },
            number: {
                notEmpty: true,
                errorMessage: "O número do ingresso é Obrigatória"
            },
            total: {
                notEmpty: true,
                errorMessage: "Valor total do ingresso é Obrigatório"
            },
            buyer: {
                notEmpty: true,
                errorMessage: "Código do cliente é Obrigatório"
            },
            document: {
                notEmpty: true,
                errorMessage: "Documento do cliente é Obrigatório"
            }
        });

        // Verifica se a entidade tem erros
        const errors = req.validationErrors();
        if (errors) {
            return res.json(TicketsErrorsProvider.GetErrorDetails(ETicketsErrors.InvalidRequiredParams, errors));
        }

        let ticketSales: TicketSaleEntity = TicketSaleEntity.GetInstance();
        ticketSales.Map(req.body);

        // Verifica se já existe o cliente cadastrado
        this.dataAccess.GetOrCreateBuyer(ticketSales.document, ticketSales.buyer, res, (res, err, result: BuyerInfoEntity) => {
            if (err) { 
                if (err.sqlMessage.indexOf('FK_FK_BUYER_USER') >= 0) {
                    return res.json(TicketsErrorsProvider.GetError(ETicketsErrors.UserNotFound));
                }

                return res.json(ServiceResult.HandlerError(err));

            } else if(!result || !result.userId) {
                return res.json(TicketsErrorsProvider.GetErrorDetails(ETicketsErrors.InvalidId, errors));
            }

            // Verificar o estoque de ingressos
            this.dataAccess.GetTicketsType(ticketSales.ticketTypeId, res, (res, err, result: TicketTypeEntity) => {
                if (err) { 
                    return res.json(ServiceResult.HandlerError(err));

                } else if(!result || !result.id) {
                    return res.json(TicketsErrorsProvider.GetErrorDetails(ETicketsErrors.InvalidId, errors));

                } else if(result.available <= 0) {
                    return res.json(TicketsErrorsProvider.GetErrorDetails(ETicketsErrors.TicketNotAvailable, errors));
                }

                // Incluir a venda
                this.dataAccess.TicketSales.CreateItem(ticketSales, res, (res, err, result) => { 
                    if (err) {
                        if (err.sqlMessage.indexOf('FK_FK_TICKET_SALE') >= 0) {
                            return res.json(TicketsErrorsProvider.GetError(ETicketsErrors.TicketNotFound));
                        } else {
                            return res.json(ServiceResult.HandlerError(err));
                        }
                    }
        
                    // Atualizar esto de ingressos
                    this.dataAccess.SoldTicketType(1, ticketSales.sectorId, ticketSales.ticketTypeId, res, (res, err, result) => { 
                        if (err) { 
                            return res.json(ServiceResult.HandlerError(err));
                        }
            
                        return res.json(ServiceResult.HandlerSucess());
                    });
                });
            });
        });
    }

    public UpdateTicketSales = (req: Request, res: Response) => { 
        // Validação dos dados de entrada
        req.checkBody({
            ticketTypeId: {
                isNumeric: true,
                errorMessage: "Código do setor inválido"
            },
            date: {
                notEmpty: true,
                errorMessage: "A data é Obrigatória"
            },
            number: {
                notEmpty: true,
                errorMessage: "O número do ingresso é Obrigatório"
            },
            total: {
                notEmpty: true,
                errorMessage: "Valor total do ingresso é Obrigatório"
            },
            buyer: {
                notEmpty: true,
                errorMessage: "Código do cliente é Obrigatório"
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

        // Recupera o ticket vendido
        this.dataAccess.GetTicketsSale(id, res, (res, err, result: TicketSaleEntity) => {
            if (err) { 
                return res.json(ServiceResult.HandlerError(err));

            } else if(!result || !result.id) {
                return res.json(TicketsErrorsProvider.GetErrorDetails(ETicketsErrors.InvalidId, errors));
            }

            var typeSale = result;

            // Exclui o ticket vendido
            this.dataAccess.TicketSales.DeleteItem([id], res, (res, err, result) => { 
                if (err) { 
                    return res.json(ServiceResult.HandlerError(err));
                }
    
                // Atualiza saldo vendido
                this.dataAccess.SoldTicketType(2, typeSale.sectorId, typeSale.ticketTypeId, res, (res, err, result) => { 
                    if (err) { 
                        return res.json(ServiceResult.HandlerError(err));
                    }
        
                    return res.json(ServiceResult.HandlerSucess());
                });
            });           
        } );
    }

    // Metodos de manipulação de Eventos
    public ListCardTransation = (req: Request, res: Response) => {
        req.checkParams("id").isNumeric();

        const errors = req.validationErrors();
        if (errors) {
            return res.json(TicketsErrorsProvider.GetErrorDetails(ETicketsErrors.InvalidOwnerId, errors));
        }

        const id = req.params["id"];

        this.dataAccess.CardTransactions.ListFilteredItems(['SALE_ID'], [id], res, this.processDefaultResult);
    }

    public GetCardTransation = (req: Request, res: Response) => {
        req.checkParams("id").isNumeric();

        const errors = req.validationErrors();
        if (errors) {
            return res.json(TicketsErrorsProvider.GetErrorDetails(ETicketsErrors.InvalidId, errors));
        }

        const id = req.params["id"];        

        this.dataAccess.Events.GetItem([id], res, (res, err, result: SystemEntity) => {
            if (err) { 
                return res.json(ServiceResult.HandlerError(err));
            }

            return res.json(ServiceResult.HandlerSuccessResult(result));            
        } );
    }
    
    public CreateCardTransation = (req: Request, res: Response) => { 
        // Validação dos dados de entrada
        req.checkBody({
            saleId: {
                notEmpty: true,
                errorMessage: "Código do ingresso é Obrigatório"
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
            
            res.json(ServiceResult.HandlerSucess());
        });
    }

    public UpdateCardTransation = (req: Request, res: Response) => { 
        // Validação dos dados de entrada
        req.checkBody({
            saleId: {
                notEmpty: true,
                errorMessage: "Código do ingresso é Obrigatório"
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

        this.dataAccess.CardTransactions.UpdateItem(card, [card.saleId.toString()],res, this.processDefaultResult);
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
}