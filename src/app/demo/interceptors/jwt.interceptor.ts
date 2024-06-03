import { Injectable } from "@angular/core";
import { AuthService } from "../service/auth.service";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable, take } from "rxjs";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.authService.user$.pipe(take(1)).subscribe({
      next: user => {
        if (user){
          // clone from the coming request and add Authorization header to that
          request=request.clone({
            setHeaders: {
              Authorization: `Bearer ${user.jwt}`
            }
          });
        }
      }
    })
    return next.handle(request);
  }
}