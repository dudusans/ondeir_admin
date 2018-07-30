import { UsersController } from './../controllers/users.controller';
import { BaseRoute } from "./base.routes";

export class UsersRoutes extends BaseRoute {
    private controller: UsersController = new UsersController();
  
    constructor() {
    super();

    this.buildRoutes();
  }

  private buildRoutes() {

    // Rotas de Gestão de Eventos
    this.router.get("/", this.controller.ListUsersAll);
  }
}
