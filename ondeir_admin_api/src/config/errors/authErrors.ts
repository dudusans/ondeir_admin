import logProvider from "../../shared/log/log-provider";
import { ApplicationLog, ELogType } from "../../shared/log/app-log.model";
import { ServiceResult } from '../../../../ondeir_admin_shared/models/base/serviceResult.model';

export enum EAuthErrors {
  InvalidUserOrPassword = 1,
  UserNotFound = 2
}

export class AuthErrorsProvider {
  public static GetError(error: EAuthErrors) {
    const errorResult: ServiceResult = new ServiceResult();
    errorResult.Executed = false;

    switch (error) {
      case EAuthErrors.InvalidUserOrPassword:
        errorResult.ErrorCode = "AUTH001";
        errorResult.ErrorMessage = "Usuário ou Senha inválidos";
        break;
      case EAuthErrors.UserNotFound:
        errorResult.ErrorCode = "AUTH002";
        errorResult.ErrorMessage = "Falha na autenticação - Usuário não encontrado.";
        break;
      default:
        break;
    }

    logProvider.SetErrorLog(errorResult);

    return errorResult;
  }
}
