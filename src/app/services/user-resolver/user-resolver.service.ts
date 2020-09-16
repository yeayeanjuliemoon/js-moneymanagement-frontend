import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from './../login/login.service';

@Injectable({
  providedIn: 'root',
})

export class UserResolverService implements Resolve<any> {
  constructor(
    private user: LoginService,
    ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any | Observable<never> {
    return this.user.getUser();
  }
}