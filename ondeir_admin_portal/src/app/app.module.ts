import { AuthService } from './shared/services/auth.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from "@angular/common/http";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import localePt from '@angular/common/locales/pt';
import { QRCodeModule, QRCodeComponent } from 'angular2-qrcode';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthGuard } from './shared/guard/auth.guard';
import { UnauthorizedInterceptor } from './shared/interceptors/unauthorized.interceptor';
import { SharedModule } from '../../../ondeir_admin_shared/shared.module';
import { AlertService } from '../../../ondeir_admin_shared/modules/alert/alert.service';
import { DialogService } from '../../../ondeir_admin_shared/modules/dialog/dialog.service';
import { AdDirective } from '../../../ondeir_admin_shared/modules/dialog/dialog.component';
import { VoucherComponent } from '../../../ondeir_ofertas/offers/voucher/voucher.component';
import { CardComponent } from '../../../ondeir_fidelidade/loyalty/card/card.component';
import { QrcodeComponent } from '../../../ondeir_fidelidade/loyalty/qrcode/qrcode.component';
import { AppConfig } from '../../../ondeir_admin_shared/config/app.config';
import { CrudService } from '../../../ondeir_admin_shared/base/crud.service';

registerLocaleData(localePt);

@NgModule({
  declarations: [
    AppComponent,
    AdDirective,
    QrcodeComponent,
    CardComponent,
    VoucherComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    SharedModule,
    BrowserAnimationsModule,
    QRCodeModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: "pt-br" },
    AuthGuard,
    AppConfig,
    AlertService,
    CrudService,
    AuthService,
    DialogService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UnauthorizedInterceptor,
      multi: true
    }
  ],
  exports: [
    QRCodeComponent
  ],
  entryComponents: [
    QrcodeComponent,
    CardComponent,
    VoucherComponent
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
