import logProvider from "../../shared/log/log-provider";
import { ServiceResult } from '../../../../ondeir_admin_shared/models/base/serviceResult.model';

export enum ETicketsErrors {
  InvalidId = 1,
  InvalidRequiredParams = 2,
  InvalidOwnerId = 3,
  InvalidEventId = 4,
  EventNotFound = 5,
  TicketNotFound = 6,
  TicketNotAvailable = 7,
  UserNotFound = 8,
  InvalidCityId = 9,
  TransactionNotFound = 10,
  ErrorCreateEvent = 11,
  TicketSaleNotFound = 12,
  TicketSaleDeleteError = 13
}

export class TicketsErrorsProvider {
  public static GetError(error: ETicketsErrors) {
    let errorResult: ServiceResult = new ServiceResult();
    errorResult = this.GetErrorEntity(error);

    logProvider.SetErrorLog(errorResult);

    return errorResult;
  }

  public static GetErrorDetails(error: ETicketsErrors, details: any) {
    const errorResult = this.GetErrorEntity(error);
    errorResult.ErrorDetails = JSON.stringify(details);
    
    logProvider.SetErrorLog(errorResult);

    return errorResult;
  }

  private static GetErrorEntity(error: ETicketsErrors): ServiceResult {
    const errorResult: ServiceResult = new ServiceResult();
    errorResult.Executed = false;

    switch (error) {
        case ETicketsErrors.InvalidId:
            errorResult.ErrorCode = "ADMIN001";
            errorResult.ErrorMessage = "Id inválido ou nulo";        
            break;   
        case ETicketsErrors.InvalidRequiredParams:
            errorResult.ErrorCode = "ADMIN002";
            errorResult.ErrorMessage = "Parâmetros obrigatórios nulos ou inválidos";
            break;
        case ETicketsErrors.InvalidOwnerId:
            errorResult.ErrorCode = "SCHO003";
            errorResult.ErrorMessage = "Código de cliente inválido ou nulo";
            break;
        case ETicketsErrors.InvalidEventId:
            errorResult.ErrorCode = "SCHO004";
            errorResult.ErrorMessage = "Código do evento inválido ou nulo";
            break;
        case ETicketsErrors.EventNotFound:
            errorResult.ErrorCode = "SCHO005";
            errorResult.ErrorMessage = "O Evento informado não foi encontrado ou está inativo";
            break;
        case ETicketsErrors.TicketNotFound:
            errorResult.ErrorCode = "SCHO006";
            errorResult.ErrorMessage = "O Setor informado não foi encontrado ou está inativo";
            break;
        case ETicketsErrors.TicketNotAvailable:
            errorResult.ErrorCode = "SCHO007";
            errorResult.ErrorMessage = "Quantidade de ingressos indisponível.";
            break;
        case ETicketsErrors.UserNotFound:
            errorResult.ErrorCode = "SCHO008";
            errorResult.ErrorMessage = "Usuário não encontrado.";
            break;
        case ETicketsErrors.InvalidCityId:
            errorResult.ErrorCode = "SCHO009";
            errorResult.ErrorMessage = "O Cidade informada não foi encontrada.";
            break;
        case ETicketsErrors.TransactionNotFound:
            errorResult.ErrorCode = "SCHO010";
            errorResult.ErrorMessage = "Dados sobre o pagamento inválido.";
            break;
        case ETicketsErrors.ErrorCreateEvent:
            errorResult.ErrorCode = "SCHO011";
            errorResult.ErrorMessage = "Error ao criar um novo evento.";
            break;
        case ETicketsErrors.TicketSaleNotFound:
            errorResult.ErrorCode = "SCHO012";
            errorResult.ErrorMessage = "A venda informada não foi encontrada ou está inválida.";
            break;
        case ETicketsErrors.TicketSaleDeleteError:
            errorResult.ErrorCode = "SCHO013";
            errorResult.ErrorMessage = "A venda não pode ser cancelada. Prazo limite para cancelamento ultrapassado.";
            break;
      default:
        break;
    }

    return errorResult;
  }
}
