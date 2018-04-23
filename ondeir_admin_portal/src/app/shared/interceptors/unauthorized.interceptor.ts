import { Router } from "@angular/router";
import { Injectable } from "@angular/core";
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpResponse,
    HttpErrorResponse,
    HttpProgressEvent,
    HttpSentEvent,
    HttpHeaderResponse,
    HttpUserEvent
} from "@angular/common/http";
import "rxjs/add/operator/do";
import { Observable } from "rxjs/Observable";
import { map, filter, tap } from 'rxjs/operators';

import { LoginResultEntity } from "../../../../../ondeir_admin_shared/models/auth/loginResult.model";

@Injectable()
export class UnauthorizedInterceptor implements HttpInterceptor {
    public loginInfo: LoginResultEntity = JSON.parse(
        localStorage.getItem("loginInfo")
    );

    constructor(private router: Router) {}

    private EndSession() {
        localStorage.removeItem("isLoggedin");
        localStorage.removeItem("loginInfo");
        this.router.navigate(["login"]);
    }

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<
        | HttpSentEvent
        | HttpHeaderResponse
        | HttpProgressEvent
        | HttpResponse<any>
        | HttpUserEvent<any>
    > {
        // next.handle(request).subscribe(
        //   (event) => {
        //     console.log(event);
        //     return next.handle(request);
        //   },
        //   (err: any) => {
        //     if (err instanceof HttpErrorResponse) {
        //       if (err.status === 401) {
        //           // redirect to the login route
        //           this.EndSession();
        //       } else if (err.status === 500) {
        //           const body = err.error;

        //           if (body.errorCode !== "" && body.errorMessage === "Unauthorized access") {
        //               // redirect to the login route
        //               this.EndSession();
        //           }
        //       }
        //     }

        //     return next.handle(request);
        //   }
        // );

        return next.handle(request).pipe(
            tap(event => {

            },
            err => {
                if (err instanceof HttpErrorResponse) {
                    if (err.status === 401) {
                        // redirect to the login route
                        this.EndSession();
                    } else if (err.status === 500) {
                        const body = err.error;

                        if (body.errorCode !== "" && body.errorMessage === "Unauthorized access") {
                            // redirect to the login route
                            this.EndSession();
                        }
                    }
                }
            })
        );
    }
}
