import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from './commonservice';
declare var jQuery: any;
declare var $: any;

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private router: Router, public commonservice: CommonService, public route: ActivatedRoute) {
    /* if (this.router.url.substring(1, 7) == 'public') {
      console.log('ENTERING', this.router.url.substring(1, 7));
      this.router.navigate([this.router.url]);
    } */
  }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const pindoroute = ['doer', 'pinner', 'notifications', 'public-pins'];
    const spliturl = this.router.url.split('/');
    const currentslug = spliturl[1];
    let isLoggedinpages = 'true';
    if (jQuery.inArray(currentslug, pindoroute) !== -1 && (currentslug == 'doer' || currentslug == 'notifications')) {
      isLoggedinpages = 'false';
    }
    if (currentslug == 'public') {
      // console.log('CONDITION TRUE');
      isLoggedinpages = 'true';
    }
    /*request = request.clone({
       setHeaders: {
         nonloggedinpages: isLoggedinpages
       }
    });*/

    return next.handle(request).do((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        const response_body = event.body;
        // console.log("CurrentSlug= ",currentslug);
        // console.log('response_body response_body',response_body);          
        const tempRequest = request['url'];
        // console.log('tempRequest',tempRequest);
        const tempTocompareUrl = `${this.commonservice.baseUrl}/check-frontend-token`;
        // console.log('tempTocompareUrl',tempTocompareUrl);
        if ((tempRequest == tempTocompareUrl) && response_body.status == 2) {
          localStorage.clear();
          this.commonservice.countSessionTimeOut = 1;
          this.commonservice.islogin = 0;

          if (jQuery.inArray(currentslug, pindoroute) !== -1 && (currentslug == 'doer' || currentslug == 'notifications')) {
            this.router.navigate(['/']);
          }
        } else {
          // console.log("Call LOGOUT MODAL");
          // if(!this.commonservice.firstTimeLoad) {
          /* if (this.router.url.substring(1, 7) == 'public') {
            console.log('ENTERING', this.router.url.substring(1, 7));
            console.log(this.router.url);
            // this.router.navigate([this.router.url]);
          } else {
            this.commonservice.responsefunction(event);
          } */
          // console.log(event, request);
          this.commonservice.responsefunction(event);
        }
      }
    }, (err: any) => {
      // console.log(err);
    });
  }

}
