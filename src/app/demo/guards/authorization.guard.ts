import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../service/auth.service';
import { User } from 'src/app/shared/models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthorizationGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.user$.pipe(
      map((user: User | null) => {
        if (user) {
          return true;
        } else {
          this.router.navigate(['connecter'], { queryParams: { returnUrl: state.url } });
          return false;
        }
      })
    );
  }
}
