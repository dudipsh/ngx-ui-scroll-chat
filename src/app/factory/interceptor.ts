import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/internal/operators';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Router} from '@angular/router';

@Injectable()

export class InterceptorService implements HttpInterceptor {
  constructor(private router: Router
              //, private userService: UserService
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const headers = {};
    const userToken = localStorage.getItem('authToken');
    headers['Content-Type'] = 'application/json; charset=UTF-8';
    if (userToken) {
      headers['Authorization'] = `${userToken}`;
    }
    // if (this.userService.getSelectedPlace()) {
    request = request.clone({
      setHeaders: {
        Authorization: `${userToken}`,
      }
    });
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          const {body} = event;
          // this.errorDialogService.openDialog(event);
        }
        return event;
      }),
      catchError((err: HttpErrorResponse) => {
        console.log(err);
        const {error, status, message} = err;
        let errorMessage = ' ';
        if (error.errors && error.errors.length) {
          errorMessage = error.errors[0].message;
        }
        alert(`${status} - ${error.errors[0].message} - ${message}`)
        return throwError(err);
      }));

  }
}
