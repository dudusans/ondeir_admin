import { TicketsController } from './../controllers/tickets.controller';
import { BaseRoute } from "./base.routes";

export class TicketsRoutes extends BaseRoute {
    private controller: TicketsController = new TicketsController();
  
    constructor() {
    super();

    this.buildRoutes();
  }

  private buildRoutes() {

    // Rotas de Gestão de Eventos
    this.router.get("/events", this.controller.ListEventsAll);
    this.router.get("/events/owner/:owner", this.controller.ListEventsByOwner);
    this.router.get("/events/city/:city", this.controller.ListEventsByCity);
    this.router.get("/events/sales/:ownerId", this.controller.ListEventsSales);
    this.router.get("/events/sales/detail/:eventId", this.controller.ListEventsSalesDetail);
    this.router.get("/events/sales/tickets/:action/:id", this.controller.ListEventsSalesTicket);
    this.router.get("/events/summary/:id", this.controller.GetEventSaleSummary);
    this.router.get("/events/photos/:id", this.controller.GetEventPhotos);
    this.router.get("/events/:id", this.controller.GetEvent);
    this.router.post("/events", this.controller.CreateEvent);
    this.router.post("/events/photos", this.controller.UploadEventPhotos);
    this.router.put("/events", this.controller.UpdateEvent);
    this.router.delete("/events/:id", this.controller.DeleteEvent);

    // Rotas de Gestão de Setores
    this.router.get("/sectors/list/:event", this.controller.ListSector);
    this.router.get("/sectors/:id", this.controller.GetSector);
    this.router.post("/sectors", this.controller.CreateSector);
    this.router.put("/sectors", this.controller.UpdateSector);
    this.router.delete("/sectors/:id", this.controller.DeleteSector);

    // Rotas de Gestão de Tipos de ingresso
    this.router.get("/types/list/:sector", this.controller.ListTicketsTypeBySector);
    this.router.get("/types/list/event/:event", this.controller.ListTicketsTypeByEvent);
    this.router.get("/types/:id", this.controller.GetTicketsType);
    this.router.post("/types", this.controller.CreateTicketsType);
    this.router.put("/types", this.controller.UpdateTicketsType);
    this.router.delete("/types/:id", this.controller.DeleteTicketsType);

    // Rotas de Gestão de Vendas de ingresso
    this.router.get("/sales/list/", this.controller.ListTicketSales);
    this.router.get("/sales/list/:ownerId", this.controller.ListTicketSalesByOwner);
    this.router.get("/sales/:id", this.controller.GetTicketSales);
    this.router.post("/sales", this.controller.CreateTicketSales);
    this.router.post("/sales/checkstock", this.controller.CheckStock);
    this.router.put("/sales", this.controller.UpdateTicketSales);
    this.router.delete("/sales/:id", this.controller.DeleteTicketSales);

    // Rotas de Gestão de pagamentos de ingressos
    this.router.get("/cardtransaction/list/:id", this.controller.ListCardTransation);
    this.router.get("/cardtransaction/:id", this.controller.GetCardTransation);
    this.router.post("/cardtransaction", this.controller.CreateCardTransation);
    this.router.put("/cardtransaction", this.controller.UpdateCardTransation);
    this.router.delete("/cardtransaction/:id", this.controller.DeleteCardTransaction);

    // Rodas de Gestão de Compradores
    this.router.get("/buyer/info/:userId", this.controller.GetBuyerInfo);

    // Rotas para utilização no APP
    this.router.get("/vouchers/:userId", this.controller.ListVouchersByUserId);
    this.router.get("/voucher/:id", this.controller.GetVoucher);
    this.router.get("/announcement/:eventId", this.controller.GetAnnouncementEvent);
  }
}
