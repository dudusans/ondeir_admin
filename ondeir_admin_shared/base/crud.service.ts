import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { BaseService } from './base.service';
import { BaseEntity } from '../models/base/base.model';
import { AppConfig } from '../config/app.config';
import { Observable } from 'rxjs/Rx';
import { ServiceResult } from '../models/base/serviceResult.model';

interface NoParamConstructor<T> {
  new (): T;
}

export abstract class BaseCRUD<T> {

  constructor(private ctor: NoParamConstructor<T>) {
  }

  protected CreateInstance(): T {
      return new this.ctor();
  }
}

@Injectable()
export class CrudService<T extends BaseEntity> extends BaseService {
  routerPath: string;
  routerKey: string;
  serviceKeys: Array<string> = new Array<string>();

  constructor(config: AppConfig, router: Router, httpClient: HttpClient) {
    super(config, router, httpClient);
  }

  public InitService(path: string, serviceKey: Array<string>) {
    this.routerPath = path;
    this.serviceKeys = serviceKey;

    this.routerKey = "";
    serviceKey.forEach(item => {
      this.routerKey += `/${item}`;
    });
  }

  public ListItems = (): Observable<Array<T>> => {
    const serviceUrl = this.config.baseUrl + this.routerPath;

    return this.GetRequest(serviceUrl);
  }

  public GetItem = (key: Array<string>): Observable<T> => {
    const serviceUrl = this.config.baseUrl + this.routerPath + this.GetKeyRouter(key);

    return this.GetRequest(serviceUrl);
  }

  public CreateItem = (newItem: T): Observable<boolean> => {
    const serviceUrl = this.config.baseUrl + this.routerPath;

    return this.PostRequest(serviceUrl, newItem);
  }

  public UpdateItem = (item: T): Observable<boolean> => {
    const serviceUrl = this.config.baseUrl + this.routerPath;

    return this.PutRequest(serviceUrl, item);
  }

  public DeleteItem = (key: Array<string>): Observable<boolean> => {
    const serviceUrl = this.config.baseUrl + this.routerPath + this.GetKeyRouter(key);

    return this.DeleteRequest(serviceUrl);
  }

  private GetKeyRouter = (key: Array<string>): string => {
    let result = "";
    key.forEach(item => {
      result += `/${item}`;
    });

    return result;
  }
}
