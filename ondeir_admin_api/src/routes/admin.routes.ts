import { BaseRoute } from "./base.routes";
import { AdminController } from '../controllers/admin.controller';

export class AdminRoutes extends BaseRoute {
    private controller: AdminController = new AdminController();
  
    constructor() {
    super();

    this.buildRoutes();
  }

  private buildRoutes() {
    this.router.post("/systems", this.controller.CreateScreen);
    this.router.get("/systems", this.controller.ListScreens);
    this.router.put("/systems", this.controller.UpdateScreen);
    this.router.delete("/systems/:id", this.controller.DeleteScreen);
    this.router.get("/systems/:id", this.controller.GetScreens);

    this.router.post("/reports", this.controller.CreateReport);
    this.router.get("/reports", this.controller.ListScreens);
    this.router.put("/reports", this.controller.UpdateScreen);
    this.router.delete("/reports/:id", this.controller.DeleteReport);
    this.router.get("/reports/:id", this.controller.GetScreens);
  }
}
