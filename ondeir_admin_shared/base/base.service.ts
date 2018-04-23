import { Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import * as Rx from 'rxjs/Rx';

import { LoginResultEntity } from "../models/auth/loginResult.model";
import { IAppConfig } from "./IApp.config";


export abstract class BaseService {
  public loginInfo: LoginResultEntity = JSON.parse(
    localStorage.getItem("authUser")
  );

  constructor(protected config: IAppConfig, protected router: Router) {
    if (localStorage.getItem("authUser") === null) {
      this.endSession();
    }
  }

  protected handleErrorObservable(error: Response | any, caugth: any) {
    
    const err = error.error;

    if (error.status === 422) {
      //return Observable.throw(err);
      return Rx.Observable.throw(err.ErrorCode + " - " + err.ErrorMessage || err);
    } else {
      return Rx.Observable.throw(error.errorMessage || error);
    }

    // return Rx.Observable.of(null);
  }

  private endSession() {
    localStorage.removeItem("isLoggedin");
    localStorage.removeItem("authUser");
    this.router.navigate(["login"]);
  }
}
