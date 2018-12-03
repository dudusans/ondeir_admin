import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';

@Injectable()
export class AppGuard implements CanActivate {
    constructor(private router: Router) {}

    canActivate() {
        console.log("fake guard");
        return true;
    }
}
