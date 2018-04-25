import { Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/observable/throw';
import * as Rx from 'rxjs/Rx';

import { LoginResultEntity } from "../models/auth/loginResult.model";
import { IAppConfig } from "./IApp.config";
import { ServiceResult } from '../models/base/serviceResult.model';

export abstract class BaseService {
  public get loginInfo(): LoginResultEntity {
    return JSON.parse(
      localStorage.getItem("authUser")
    );
  }

  constructor(protected config: IAppConfig, protected router: Router, protected httpClient?: HttpClient) {
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

  /** Http generic Methods */
  protected GetRequest = (serviceUrl: string): Observable<any> => {
    return this.httpClient.get(serviceUrl).map(
      (res: ServiceResult) => {
        return res.Result;
      }
    ).catch(this.handleErrorObservable);
  }

  protected PostRequest = (serviceUrl: string, objBody: any): Observable<any> => {
    return this.httpClient.post(serviceUrl, objBody).map(
      (res: ServiceResult) => {
        return res.Result;
      }
    ).catch(this.handleErrorObservable);
  }

  protected PutRequest = (serviceUrl: string, objBody: any): Observable<boolean> => {
    return this.httpClient.put(serviceUrl, objBody).map(
      (res: ServiceResult) => {
        return res.Executed;
      }
    ).catch(this.handleErrorObservable);
  }

  protected DeleteRequest = (serviceUrl: string): Observable<boolean> => {
    return this.httpClient.delete(serviceUrl).map(
      (res: ServiceResult) => {
        return res.Executed;
      }
    ).catch(this.handleErrorObservable);
  }
}
