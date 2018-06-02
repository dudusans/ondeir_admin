import { ClassifiedsController } from './../controllers/classifieds.controller';
import { BaseRoute } from "./base.routes";

export class ClassifiedRoutes extends BaseRoute {
    private controller: ClassifiedsController = new ClassifiedsController();
  
    constructor() {
    super();

    this.buildRoutes();
  }

  private buildRoutes() {

    // Rotas de Gestão de Lojas
    this.router.get("/stores/city/:id", this.controller.ListStores);
    this.router.get("/stores", this.controller.ListStores);
    this.router.get("/stores/:id", this.controller.GetStore);
    this.router.post("/stores", this.controller.CreateStore);
    this.router.put("/stores", this.controller.UpdateStore);
    this.router.delete("/stores/:id", this.controller.DeleteStore);

    // Rotas de Gestão de Produtos/Anuncios
    this.router.get("/products/owner/:ownerId", this.controller.ListOwnerProducts);
    this.router.get("/products", this.controller.ListProducts);
    this.router.get("/products/:type/:id", this.controller.GetProduct);
    this.router.post("/products/motors", this.controller.CreateMotorClassified);
    this.router.put("/products/motors", this.controller.UpdateMotorClassified);
    this.router.post("/products/estates", this.controller.CreateEstatesClassified);
    this.router.put("/products/estates", this.controller.CreateEstatesClassified);
    this.router.post("/products/photos", this.controller.UploadClassifiedPhotos);
    this.router.put("/products", this.controller.UpdateStore);
    this.router.delete("/products/:id", this.controller.DeleteProduct);

    // Rota de Montadoras
    this.router.get("/assemblers", this.controller.ListAssemblers);

    // Rotas de Gestão de Contatos
    this.router.get("/contacts/:ownerId", this.controller.ListContact);
    this.router.get("/classifiedcontacts/:id", this.controller.ListClassifiedContacts);
    this.router.post("/contacts", this.controller.CreateStore);

    // Rotas de callback
    this.router.get("/set/:id", this.controller.SetAccess);
    this.router.get("/revoke/:id", this.controller.RevokeAccess);
  }
}
