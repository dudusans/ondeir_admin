import { Request, Response } from "express";

import { Utils } from '../../../ondeir_admin_shared/utils/Utils';
import { BaseController } from './base.controller';
import { ServiceResult } from '../../../ondeir_admin_shared/models/base/serviceResult.model';
import { SystemEntity } from '../../../ondeir_admin_shared/models/admin/system.model';
import { UsersDAO } from '../dataaccess/user/usersDAO';
import { UserEntity } from '../../../ondeir_admin_shared/models/users/userEntity';
import { json } from "body-parser";
import { TicketsErrorsProvider, ETicketsErrors } from "../config/errors/tickets.errors";

export class UsersController extends BaseController {
    
    private dataAccess: UsersDAO = new UsersDAO();

    // Metodos de manipulação de Usuarios
    public ListUsersAll = (req: Request, res: Response) => {
        const errors = req.validationErrors();

        if (errors) {
            return res.json(TicketsErrorsProvider.GetErrorDetails(ETicketsErrors.InvalidOwnerId, errors));
        }

        this.dataAccess.ListUsers(res, this.processDefaultResult);
    }
}