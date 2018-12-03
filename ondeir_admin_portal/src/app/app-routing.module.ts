import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AuthGuard } from "./shared/guard/auth.guard";
import { AppGuard } from './shared/guard/app.guard';

const routes: Routes = [
  { path: 'ondeir', loadChildren: "./modules/mobile/mobile.module#MobileModule", canActivate: [AppGuard]},
  { path: '', loadChildren: "./shell/shell.module#ShellModule", canActivate: [AuthGuard]},
  { path: 'mobile', loadChildren: "./modules/mobile/mobile.module#MobileModule"},
  { path: 'app', loadChildren: "./modules/mobile/mobile.module#MobileModule"},
  { path: 'login', loadChildren: './login/login.module#LoginModule' },
  { path: 'not-found', loadChildren: './not-found/not-found.module#NotFoundModule' },
  { path: '**', redirectTo: 'not-found' }
];

@NgModule({
  // Routing debbuging configurations.
  // imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {}
