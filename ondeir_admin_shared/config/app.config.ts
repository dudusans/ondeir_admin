import { Injectable } from "@angular/core";

// Serviço provedor de configurações da aplicação
@Injectable()
export class AppConfig {
  // API Configs

  // Local Container
  baseUrl: string = 'http://localhost:8001/v0/';
  // baseUrl: string = 'http://localhost:8081/v0/';

  // Dev Container
  // baseUrl: string = 'http://ondeir-dev.sa-east-1.elasticbeanstalk.com/v0/';
  //  baseUrl: string= 'http://onde-ir-fidelidade-api-ondeirfidelidade.7e14.starter-us-west-2.openshiftapps.com/v0/';

  // Prod Container
  // baseUrl: string = 'http://appondeir.azurewebsites.net/ondeircuritiba/';
  // baseUrl: string = 'https://api.ondeircidades.com.br/v0/';

  // Aplication Configurations

  // App Onde Ir Api
  // ondeIrApi: string = 'http://appondeir.azurewebsites.net/ondeircuritiba/ondeir/';
   ondeIrApi: string = 'https://www.appondeir.com.br/sistema/rest/';
}
