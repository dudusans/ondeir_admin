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

    // Rotas de callback
    this.router.get("/set/:id", this.controller.SetAccess);
    this.router.get("/revoke/:id", this.controller.RevokeAccess);
  }
}
