import logProvider from "../../shared/log/log-provider";
import { ServiceResult } from '../../../../ondeir_admin_shared/models/base/serviceResult.model';

export enum EClassifiedsErrors {
  InvalidId = 1,
  InvalidRequiredParams = 2,
  LogoUploadError = 3,
  InvalidMotorsRequiredParams = 4,
  InvalidCNPJ = 5,
  InvalidCPF = 6,
  CNPJAlreadyExists = 7
}

export class ClassifiedsErrorsProvider {
  public static GetError(error: EClassifiedsErrors) {
    let errorResult: ServiceResult = new ServiceResult();
    errorResult = this.GetErrorEntity(error);

    logProvider.SetErrorLog(errorResult);

    return errorResult;
  }

  public static GetErrorDetails(error: EClassifiedsErrors, details: any) {
    const errorResult = this.GetErrorEntity(error);
    errorResult.ErrorDetails = JSON.stringify(details);
    
    logProvider.SetErrorLog(errorResult);

    return errorResult;
  }

  private static GetErrorEntity(error: EClassifiedsErrors): ServiceResult {
    const errorResult: ServiceResult = new ServiceResult();
    errorResult.Executed = false;

    switch (error) {
        case EClassifiedsErrors.InvalidId:
            errorResult.ErrorCode = "ADMIN001";
            errorResult.ErrorMessage = "Id inválido ou nulo";        
            break;   
        case EClassifiedsErrors.InvalidRequiredParams:
            errorResult.ErrorCode = "ADMIN002";
            errorResult.ErrorMessage = "Parâmetros obrigatórios nulos ou inválidos";
        case EClassifiedsErrors.LogoUploadError:
            errorResult.ErrorCode = "ADMIN003";
            errorResult.ErrorMessage = "Erro no upload da imagem do classificado";        
            break;   
        case EClassifiedsErrors.InvalidMotorsRequiredParams:
            errorResult.ErrorCode = "CLASS001";
            errorResult.ErrorMessage = "Parâmetros obrigatórios de automóvel nulos ou inválidos";
            break;
        case EClassifiedsErrors.InvalidCNPJ:
            errorResult.ErrorCode = "SCHO003";
            errorResult.ErrorMessage = "CNPJ Inválido";
            break;
        case EClassifiedsErrors.InvalidCPF:
            errorResult.ErrorCode = "SCHO004";
            errorResult.ErrorMessage = "CPF Inválido";
            break;
        case EClassifiedsErrors.CNPJAlreadyExists:
            errorResult.ErrorCode = "SCHO005";
            errorResult.ErrorMessage = "CNPJ já cadastrado no neno app";
            break;
      default:
        break;
    }

    return errorResult;
  }
}
