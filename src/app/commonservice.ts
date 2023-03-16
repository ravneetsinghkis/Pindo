import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { Globalconstant } from './global_constant';
import { catchError, last, map, tap, retry } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import { BehaviorSubject } from 'rxjs';
declare var jQuery: any;
declare var $: any;
declare var io: any;
declare var Swiper: any;
import * as CryptoJS from 'crypto-js';
import { Meta, Title } from '@angular/platform-browser';
import { environment } from '../environments/environment';
//import 'rxjs/add/operator/toPromise';
//import 'rxjs/add/operator/do';

declare const google: any;

@Injectable()
export class CommonService {
  requests = [];
  res = null;
  error = null;
  logoutdata: any = {};
  islogin = 0;
  public user_type: any;
  public headers: any;
  public contenttype: string = 'application/json';
  public sendingdata: any;
  nodeApiUrl: any;
  is_onesignal_initialized = 0;
  private socket;
  baseUrl: any;
  communityUrl: any = '';
  environment: any = environment;
  private messageSource = new BehaviorSubject(this.islogin);
  currentLoginValue = this.messageSource.asObservable();

  private paymentRequest = new BehaviorSubject<boolean>(false);
  paymentRequestValue = this.paymentRequest.asObservable();

  addressHeader: any = null;
  headeraddresslat: any = null;
  headeraddressLng: any = null;

  csrf_token = '';

  selectedCategoryFromHomepage: any = null;

  queryUrl = '/home-page-search-autocomplete?search=';
  firstTimeLoad = false;

  allowedImageTypes = ["jpg", "png", "jpeg", "gif"];
  allowedPostUploadedFileExtensions = ".pdf, .png, .jpg, .jpeg, .gif";
  allowedPostUploadedFiles = ["image/jpeg", "image/png", "application/pdf", "image/gif"];

  constructor(private http: HttpClient,
    private router: Router,
    public myGlobals: Globalconstant,
    private meta: Meta,
    private title: Title
  ) {
    this.baseUrl = this.environment.baseUrl;
    this.communityUrl = this.environment.communityUrl;
    // console.log(this.baseUrl);
    this.communityUrl = this.environment.communityUrl;

  }

  generateTags(config) {
    this.meta.updateTag({ property: 'og:title', content: config.title });
    // this.meta.updateTag({ property: 'og:image', content: config.img });
  }

  changeFunction(message: number) {
    // console.log("registration and logintime call.......................................")
    this.messageSource.next(message);
  }

  changePaymentRequest(response) {
    this.paymentRequest.next(response);
  }

  private _listners = new Subject<any>();
  private _listnerRemoveEndorsement = new Subject<any>();
  private _listnerGoToPins = new Subject<any>();
  private _listnerSearchFromHeaderPinnerLogin = new Subject<any>();
  private _listnerSearchFromHeaderDoerLogin = new Subject<any>();
  private _listnerForSessionTimeout = new Subject<any>();
  private _listnerForPopulateDoer = new Subject<any>();
  private _listnerForInviteDoerLocationFilter = new Subject<any>();
  private _listnerForNewFolderCreation = new Subject<any>();
  private _listnerForDynamicFormSubmit = new Subject<any>();
  private _listnerForHeaderAddressChange = new Subject<any>();
  public _confirmBeforeMovingMessagePage = new Subject<any>();
  public _listnerForMovingMessageModalData = new Subject<any>();
  public _listnerForLogoutClicked = new Subject<Boolean>();

  private logoutSubject = new Subject();
  logoutHandler = this.logoutSubject.asObservable();

  countSessionTimeOut = 0;


  listen(): Observable<any> {
    return this._listners.asObservable();
  }

  listenEndorsement(): Observable<any> {
    return this._listnerRemoveEndorsement.asObservable();
  }

  listenPinnerSearch(): Observable<any> {
    return this._listnerSearchFromHeaderPinnerLogin.asObservable();
  }

  listenDoerSearch(): Observable<any> {
    return this._listnerSearchFromHeaderDoerLogin.asObservable();
  }

  listnerGoToPins(): Observable<any> {
    return this._listnerGoToPins.asObservable();
  }

  listnerSessionTimeout(): Observable<any> {
    return this._listnerForSessionTimeout.asObservable();
  }

  listnerPopulateDoer(): Observable<any> {
    return this._listnerForPopulateDoer.asObservable();
  }

  listnerFilterLocation(): Observable<any> {
    return this._listnerForInviteDoerLocationFilter.asObservable();
  }

  listnerCreateNewFolder(): Observable<any> {
    return this._listnerForNewFolderCreation.asObservable();
  }

  listnerDynamicFormSubmit(): Observable<any> {
    return this._listnerForDynamicFormSubmit.asObservable();
  }

  listnerHeaderAddressChange(): Observable<any> {
    return this._listnerForHeaderAddressChange.asObservable();
  }

  filter(filterBy: string) {
    this._listners.next(filterBy);
  }

  filterEndorsement(filterBy: string) {
    this._listnerRemoveEndorsement.next(filterBy);
  }

  filterPinnerSearch(filterBy: string) {
    this._listnerSearchFromHeaderPinnerLogin.next(filterBy);
  }

  filterDoerSearch(filterBy: string) {
    this._listnerSearchFromHeaderDoerLogin.next(filterBy);
  }

  filterGoTOPins(filterBy: string) {
    this._listnerGoToPins.next(filterBy);
  }

  filterSessionTimeout(filterBy: string) {
    // console.log('dsadfsfdsfdsfds filterSessionTimeout');
    this._listnerForSessionTimeout.next(filterBy);
  }

  filterPopulateDoer(filterBy: string) {
    this._listnerForPopulateDoer.next(filterBy);
  }

  filterLocationInvite(filterBy: string) {
    this._listnerForInviteDoerLocationFilter.next(filterBy);
  }

  filterNewFolderCreation(filterBy: string) {
    this._listnerForNewFolderCreation.next(filterBy);
  }

  filterDynamicFormSubmit(filterBy: any) {
    this._listnerForDynamicFormSubmit.next(filterBy);
  }

  filterHeaderAddressChange(filterBy: any) {
    this._listnerForHeaderAddressChange.next(filterBy);
  }

  confirmBeforeMovingMessagePage(data: any) {
    this._confirmBeforeMovingMessagePage.next(data);
  }

  listenBidPageMoveDialogData(data: any) {
    this._listnerForMovingMessageModalData.next(data);
  }

  _listnerForLogoutClickedData(data) {
    this._listnerForLogoutClicked.next(data);
  }

  initiateLogout(data) {
    this.logoutSubject.next(data);
  }

  responsefunction(res: any): void {
    //Hide http loader
    // console.log(res.body);
    try {
      let response_body = res.body;
      // console.log(response_body);
      if (response_body.status == 2 || response_body.status == 3) {
        // console.log('sessionExpiredOrInvalid');
        this.sessionExpiredOrInvalid(response_body);
      }
    } catch (err) { }
  }

  homeSearch(terms: Observable<string>, queryString: any) {
    // console.log(terms);
    return terms.debounceTime(400)
      .distinctUntilChanged()
      .switchMap(term => this.searchEntries(term, queryString));
  }

  searchEntries(term, queryString) {
    return this.http
      .get(this.baseUrl + queryString + term)
      .map(res => res);
  }

  sessionExpiredOrInvalid(responseJson) {
    // console.log('testing logout popup', responseJson);
    if (responseJson.status == 2 || responseJson.status == 3) {
      this.logoutdata.user_id = localStorage.getItem('frontend_user_id');
      this.logoutdata.auth_token = localStorage.getItem('frontend_token');
      //this.postHttpCall({url:'/user-logout', data:this.logoutdata}).then(result=>this.logoutFunction(result));
      // console.log('yes Session', responseJson['last_login_more_than_aday']);
      if (this.countSessionTimeOut == 0) {

        if (responseJson.status == 2 && this.countSessionTimeOut == 0) {
          this.countSessionTimeOut = 1;
          this.filterSessionTimeout('Your session expired and you\'re being logged out of the system. Please log back in to continue.');
        } else {
          this.filterSessionTimeout('Blocked');
        }
        this.countSessionTimeOut = 1;
      }
      localStorage.removeItem('frontend_user_id');
      localStorage.removeItem('frontend_token');
      localStorage.removeItem('frontend_token');
      localStorage.removeItem('x-access-token');
      localStorage.removeItem('admin_create_doer');
      this.islogin = 0;
      this.router.navigate(['/login']);
    }
  }

  logoutFunction(response) {
    if (response.status == 1) {
      //After Logout //
      localStorage.removeItem('frontend_user_id');
      localStorage.removeItem('frontend_token');
      localStorage.removeItem('user_type');
      localStorage.removeItem('admin_create_doer');
      this.islogin = 0;
      this.router.navigate(['/login']);
      this.countSessionTimeOut = 0;
    }
  }

  getHttpCall(senddata: any, smallloader = false) {
    if (($('.total_loader').css('display') == 'block' || $('.total_loader').css('display') != 'inline-block') && !smallloader) {
      $('.total_loader').show();
    }
    if (senddata.contenttype) {
      if (localStorage.getItem('frontend_token') == null) {
        this.headers = new HttpHeaders({ 'access-token': '', 'Cache-Control': 'no-cache' });
      } else {
        this.headers = new HttpHeaders({ 'access-token': localStorage.getItem('frontend_token'), 'Cache-Control': 'no-cache' });
      }
    } else {
      this.headers = new HttpHeaders({ 'Content-Type': 'application/json', 'access-token': 'aaaaa', 'Cache-Control': 'no-cache' });
    }

    /*  console.log("=================================");
      console.log(senddata)
  */
    return this.http
      .get(this.baseUrl + senddata.url, { headers: this.headers })
      .toPromise()
      .then(res => {
        $('.total_loader').hide();
        return res;
      })
      .catch(this.handleError);
  }

  postHttpCall(senddata: any, smallloader = false) {
    if (($('.total_loader').css('display') == 'block' || $('.total_loader').css('display') != 'inline-block') && !smallloader) {
      $('.total_loader').show();
    }
    if (senddata.contenttype) {
      if (localStorage.getItem('frontend_token') == null) {
        this.headers = new HttpHeaders({ 'access-token': '', 'Cache-Control': 'no-cache', 'csrf-token': this.csrf_token });
      } else {
        this.headers = new HttpHeaders({ 'access-token': localStorage.getItem('frontend_token'), 'Cache-Control': 'no-cache', '_token': this.csrf_token });
      }
    } else {
      this.headers = new HttpHeaders({ 'Content-Type': 'application/json', 'access-token': 'aaaaa', 'Cache-Control': 'no-cache', '_token': this.csrf_token });

    }
    // console.log(senddata);

    /*  console.log("=================================");
      console.log(senddata)
  */
    //senddata.data['_token'] = this.csrf_token;

    return this.http
      .post(this.baseUrl + senddata.url, senddata.data, { headers: this.headers })
      .toPromise()
      .then(res => {
        $('.total_loader').hide();
        return res;
      })
      .catch(this.handleError);
  }
  //communityUrl
  postCommunityHttpCall(senddata: any, smallloader = false) {
    if (($('.total_loader').css('display') == 'block' || $('.total_loader').css('display') != 'inline-block') && !smallloader) {
      $('.total_loader').show();
    }
    if (senddata.contenttype) {
      if (localStorage.getItem('x-access-token') == null) {
        this.headers = new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': '', 'Cache-Control': 'no-cache', '_token': this.csrf_token });
      } else {
        this.headers = new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': localStorage.getItem('x-access-token'), 'Cache-Control': 'no-cache', '_token': this.csrf_token });
      }
    } else {
      this.headers = new HttpHeaders({ 'x-access-token': localStorage.getItem('x-access-token'), 'Cache-Control': 'no-cache', '_token': this.csrf_token });

    }
    return this.http
      .post(this.communityUrl + senddata.url, senddata.data, { headers: this.headers })
      .toPromise()
      .then(res => {
        $('.total_loader').hide();
        return res;
      })
      .catch(this.handleError);
  }
  //// form
  //// communityurl put method
  putCommunityHttpCall(senddata: any, smallloader = false) {
    if (($('.total_loader').css('display') == 'block' || $('.total_loader').css('display') != 'inline-block') && !smallloader) {
      $('.total_loader').show();
    }
    if (senddata.contenttype) {
      if (localStorage.getItem('x-access-token') == null) {
        this.headers = new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': '', 'Cache-Control': 'no-cache', '_token': this.csrf_token });
      } else {
        this.headers = new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': localStorage.getItem('x-access-token'), 'Cache-Control': 'no-cache', '_token': this.csrf_token });
      }
    } else {
      this.headers = new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': 'aaaaa', 'Cache-Control': 'no-cache', '_token': this.csrf_token });

    }

    /*  console.log("=================================");
      console.log(senddata)
  */
    //senddata.data['_token'] = this.csrf_token;

    return this.http
      .put(this.communityUrl + senddata.url, senddata.data, { headers: this.headers })
      .toPromise()
      .then(res => {
        $('.total_loader').hide();
        return res;
      })
      .catch(this.handleError);
  }


  deleteCommunityHttpCall(senddata: any, smallloader = false) {
    if (($('.total_loader').css('display') == 'block' || $('.total_loader').css('display') != 'inline-block') && !smallloader) {
      $('.total_loader').show();
    }
    if (senddata.contenttype) {
      if (localStorage.getItem('x-access-token') == null) {
        this.headers = new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': '', 'Cache-Control': 'no-cache', '_token': this.csrf_token });
      } else {
        this.headers = new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': localStorage.getItem('x-access-token'), 'Cache-Control': 'no-cache', '_token': this.csrf_token });
      }
    } else {
      this.headers = new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': 'aaaaa', 'Cache-Control': 'no-cache', '_token': this.csrf_token });

    }

    /*  console.log("=================================");
      console.log(senddata)
  */
    //senddata.data['_token'] = this.csrf_token;

    return this.http
      .delete(this.communityUrl + senddata.url, { headers: this.headers })
      .toPromise()
      .then(res => {
        $('.total_loader').hide();
        return res;
      })
      .catch(this.handleError);
  }

  getCommunityHttpCall(senddata: any, smallloader = false) {
    if (($('.total_loader').css('display') == 'block' || $('.total_loader').css('display') != 'inline-block') && !smallloader) {
      $('.total_loader').show();
    }
    if (senddata.contenttype) {
      if (localStorage.getItem('frontend_token') == null) {
        this.headers = new HttpHeaders({ 'access-token': '', 'Cache-Control': 'no-cache' });
      } else {
        this.headers = new HttpHeaders({ 'access-token': localStorage.getItem('frontend_token'), 'Cache-Control': 'no-cache' });
      }
    } else {
      this.headers = new HttpHeaders({ 'Content-Type': 'application/json', 'access-token': 'aaaaa', 'Cache-Control': 'no-cache' });
    }

    /*  console.log("=================================");
      console.log(senddata)
  */
    return this.http
      .get(this.baseUrl + senddata.url, { headers: this.headers })
      .toPromise()
      .then(res => {
        $('.total_loader').hide();
        return res;
      })
      .catch(this.handleError);
  }

  getHttpAddressCall(senddata: any, smallloader = false) {
    if (($('.total_loader').css('display') == 'block' || $('.total_loader').css('display') != 'inline-block') && !smallloader) {
      $('.total_loader').show();
    }
    if (senddata.contenttype) {
      if (localStorage.getItem('frontend_token') == null) {
        this.headers = new HttpHeaders({ 'access-token': '', 'Cache-Control': 'no-cache' });
      } else {
        this.headers = new HttpHeaders({ 'access-token': localStorage.getItem('frontend_token'), 'Cache-Control': 'no-cache' });
      }
    } else {
      this.headers = new HttpHeaders({ 'Content-Type': 'application/json', 'access-token': 'aaaaa', 'Cache-Control': 'no-cache' });
    }

    /*  console.log("=================================");
      console.log(senddata)
  */
    return this.http
      .get(senddata.url, { headers: this.headers })
      .toPromise()
      .then(res => {
        $('.total_loader').hide();
        return res;
      })
      .catch(this.handleError);
  }


  postChatHttpCall(senddata: any, smallloader = false) {
    if (($('.total_loader').css('display') == 'block' || $('.total_loader').css('display') != 'inline-block') && !smallloader) {
      $('.total_loader').show();
    }
    if (senddata.contenttype) {
      this.headers = new Headers({ 'access-token': localStorage.getItem('frontend_token') });
    } else {
      this.headers = new Headers({ 'Content-Type': 'application/json', 'access-token': localStorage.getItem('frontend_token') });
    }
    //this.headers = new Headers({contenttype,'access-token':localStorage.getItem('frontend_token')});

    return this.http
      .post(this.myGlobals.apiChatUrl + senddata.url, senddata.data, { headers: this.headers })
      .toPromise()
      .then(res => {
        $('.total_loader').hide();
        return res;
      })
      .catch(this.handleError);
  }


  /*postChatHttpCall(senddata:any) : Promise <any>{

    if(senddata.contenttype){
      this.headers = new Headers({'access-token':localStorage.getItem('frontend_token')});
    }else{
      this.headers = new Headers({'Content-Type': 'application/json','access-token':localStorage.getItem('frontend_token')});
    }
    //this.headers = new Headers({contenttype,'access-token':localStorage.getItem('frontend_token')});

    return this.http
      .post(this.myGlobals.apiChatUrl+senddata.url,senddata.data,{headers: this.headers})
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }*/


  observablePostHttp(senddata: any, smallloader = false) {
    if (($('.total_loader').css('display') == 'block' || $('.total_loader').css('display') != 'inline-block') && !smallloader) {
      $('.total_loader').show();
    }
    if (senddata.contenttype) {
      if (localStorage.getItem('frontend_token') == null) {
        this.headers = new HttpHeaders({ 'access-token': '', 'Cache-Control': 'no-cache' });
      } else {
        this.headers = new HttpHeaders({ 'access-token': localStorage.getItem('frontend_token'), 'Cache-Control': 'no-cache' });
      }
    } else {
      this.headers = new HttpHeaders({ 'Content-Type': 'application/json', 'access-token': 'aaaaa', 'Cache-Control': 'no-cache' });
    }

    //console.log(senddata)

    return this.http
      .post(this.myGlobals.apiUrl + senddata.url, senddata.data, { headers: this.headers })
      .pipe(
        retry(3),
        catchError(this.observableHandleError)
      );
  }

  private observableHandleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.log('An error occurred:', error['exception']);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.log('body has', error['message']);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }


  postHttpCallNode(senddata: any, smallloader = false) {
    if (($('.total_loader').css('display') == 'block' || $('.total_loader').css('display') != 'inline-block') && !smallloader) {
      $('.total_loader').show();
    }
    if (senddata.contenttype) {
      if (localStorage.getItem('frontend_token') == null) {
        this.headers = new HttpHeaders({ 'access-token': '' });
      } else {
        this.headers = new HttpHeaders({ 'access-token': localStorage.getItem('frontend_token') });
      }
    } else {
      this.headers = new HttpHeaders({ 'Content-Type': 'application/json', 'access-token': 'aaaaa' });
    }
    return this.http
      .post(this.myGlobals.nodeApiUrl + senddata.url, senddata.data, { headers: this.headers })
      .toPromise()
      .then(res => {
        $('.total_loader').hide();
        return res;
      })
      .catch(this.handleError);
  }

  /*dummyHttp(httpUrl): Observable {
    let apiURL = `${this.myGlobals.apiUrl}`;
    return this.http.get(apiURL)
  }*/


  /*postHttpCall (senddata:any): Observable<any> {
    if(senddata.contenttype){
      this.headers = new HttpHeaders({'access-token':localStorage.getItem('frontend_token')});
    }else{
      this.headers = new HttpHeaders({'Content-Type': 'application/json','access-token':localStorage.getItem('frontend_token')});
    }return this.http
      .post(this.myGlobals.apiUrl+senddata.url,senddata.data,{headers: this.headers})
      .toPromise()
      .then(res => res)
      .catch(this.handleError);
  }*/


  handleError(error: any): Promise<any> {
    console.log(error);
    $('.total_loader').hide();
    return Promise.reject(error.message || error);
  }

  redirctIfAlreadyLoggedIn() {
    /*localStorage.setItem('frontend_user_id',btoa(response.data.id));
    localStorage.setItem('frontend_token',response.token);
    localStorage.setItem('user_type',btoa(response.data.user_type));
    console.log('response.data.type',response.data.user_type);

    this.appService.islogin = 1;
    this.appService.user_type = response.data.user_type;
    if(response.data.user_type == '1'){
        window.location.href= this.globalconstant.pinnerUrl;
        //this.router.navigate(['/pinner/dashboard']);
    }else{
        window.location.href= this.globalconstant.doerUrl;
        //this.router.navigate(['/doer/dashboard']);
    } */
  }

  /**
   * Gets current location
   */
  getCurrentLocation() {
    // console.log("location calll FROM COMMON", this.environment.defaultLocationAddress);
    if (navigator.geolocation) {
      // console.log("location success COMMON");
      navigator.geolocation.getCurrentPosition((result) => {
        console.log("RESULT= ", result);
        this.setCurrentLocation(result);
      }, (error) => {
        // if (error.code == error.PERMISSION_DENIED) {
        // console.log("you denied me :-(");
        this.setHeaderAddress(this.environment.defaultLocationAddress, this.environment.defaultLocationLat, this.environment.defaultLocationLng);
        // }
      });
      // navigator.geolocation.watchPosition((position)=> {
      //   console.log("i'm tracking you!");
      // },(error)=> {
      //   if (error.code == error.PERMISSION_DENIED)
      //     console.log("you denied me :-(");
      // });
    } else {
      console.log("Geo location not supported in this browser");
      this.setHeaderAddress(this.environment.defaultLocationAddress, this.environment.defaultLocationLat, this.environment.defaultLocationLng);
    }
  }



  /**
   * Sets header address
   * @param address
   * @param lat
   * @param lng
   */
  setHeaderAddress(address, lat, lng) {
    // console.log("ADDRESS= ", address);
    localStorage.setItem('pindo_system_current_position_address', address);
    localStorage.setItem('pindo_system_current_position_lat', lat);
    localStorage.setItem('pindo_system_current_position_lng', lng);
    // localStorage.setItem('current_position_lat_backup', lat);
    // localStorage.setItem('current_position_lng_backup', lng);
    // localStorage.setItem('current_address_backup', address);

    this.addressHeader = {
      'formatted_address': address
    };
    this.headeraddresslat = lat;
    this.headeraddressLng = lng;

    this.filterHeaderAddressChange(true);
  }

  /**
   * Encodes common service
   * @param doer_id
   * @returns
   */
  encode(doer_id) {
    return btoa(doer_id);
  }

  openWithNewTab(doer_id) {
    let b64 = CryptoJS.AES.encrypt(`${doer_id}`, 'Secret Key').toString();
    let e64 = CryptoJS.enc.Base64.parse(b64);
    let eHex = e64.toString(CryptoJS.enc.Hex);
    this.router.navigate([]).then(result => { window.open(`doer/doer-profile/${eHex}`, '_blank'); });
  }

  openWithNewTabDoerOrPinner(user_id: number, user_type: number) {
    let b64 = CryptoJS.AES.encrypt(`${user_id}`, 'Secret Key').toString();
    let e64 = CryptoJS.enc.Base64.parse(b64);
    let eHex = e64.toString(CryptoJS.enc.Hex);
    if (user_type == 1) {
      // this.router.navigate([]).then(result => { window.open(`public/pinner-profile/${eHex}`, '_blank'); });
      this.router.navigate(["/public/pinner-profile", eHex]);
    } else {
      // this.router.navigate([]).then(result => { window.open(`doer/doer-profile/${eHex}`, '_blank'); });
      this.router.navigate(["/doer/doer-profile", eHex]);
    }
  }


  /**
   * Shows position
   * @param position
   * @param [fromInvitePage]
   * NEED TO REMOVE THIS FUNCTION
   */
  showPosition(position, fromInvitePage = false) {
    console.log('CUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU');
    var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    var tempLat = position.coords.latitude;
    var tempLng = position.coords.longitude;
    //var that = this;
    //console.log(position.coords.latitude,'asdasd',position.coords.longitude)
    var geocoder = geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'latLng': latlng }, function (results, status) {

      if (status == google.maps.GeocoderStatus.OK) {
        if (results[1]) {
          console.log(results[0]);
          localStorage.setItem('pindo_system_current_position_lat', tempLat);
          localStorage.setItem('pindo_system_current_position_lng', tempLng);
          localStorage.setItem('current_position_lat_backup', tempLat);
          localStorage.setItem('current_position_lng_backup', tempLng);
          //localStorage.setItem('pindo_system_current_position_address', results[1].formatted_address);
          let storableLocation = {};

          for (let ac = 0; ac < results[0].address_components.length; ac++) {
            var component = results[0].address_components[ac];
            console.log('component', component);
            if (component.types.includes('sublocality') || component.types.includes('locality')) {
              storableLocation['city'] = component.long_name;
            } else if (component.types.includes('administrative_area_level_1')) {
              storableLocation['state'] = component.short_name;
            } else if (component.types.includes('country')) {
              storableLocation['country'] = component.long_name;
              storableLocation['registered_country_iso_code'] = component.short_name;
            } else if (component.types.includes('postal_code')) {
              storableLocation['zipCode'] = component.long_name;
            }
            if (ac == (results[0].address_components.length - 1) && ($('#searchFieldUnique').length > 0 || $(document).find('#searchField').length > 0)) {
              /*$('#cityName').val(storableLocation['city']);
              $('#zipCode').val(storableLocation['zipCode']);*/
              //console.log('ayan',$('#searchField').length,storableLocation['zipCode']);
              console.log($('#searchFieldUnique').length > 0);
              if (storableLocation['zipCode']) {
                if ($('#searchFieldUnique').length > 0) {
                  $(document).find('#searchFieldUnique').val(storableLocation['zipCode']);
                } else {
                  $(document).find('#searchField').val(storableLocation['zipCode']);
                }

                //console.log(this)
                //this.filterLocationInvite(JSON.stringify(storableLocation['zipCode']));
              } else {
                if ($('#searchFieldUnique').length > 0) {
                  $('#searchFieldUnique').val(storableLocation['city']);
                } else {
                  $(document).find('#searchField').val(storableLocation['city']);
                }
                //this.filterLocationInvite(JSON.stringify(storableLocation['city']));
              }

              $('.searchIcon').trigger('click');
            }
          }
          var res_arr = results[1].formatted_address.split(',');
          var sliced_res_arr = res_arr.slice(0, -3);
          var formatted_address = sliced_res_arr.join(' ');
          var formatted_address_full = formatted_address + ' ' + storableLocation['city'] + ', ' + storableLocation['state'] + ' ' + storableLocation['zipCode'];
          console.log('formatted_address', formatted_address);
          localStorage.setItem('pindo_system_current_position_address', formatted_address_full);
          localStorage.setItem('current_address_backup', formatted_address_full);
        }
      }
    });
  }


  /**
   * Sets current location
   * @param position
   */
  setCurrentLocation(position) {
    var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    var tempLat = position.coords.latitude;
    var tempLng = position.coords.longitude;
    var geocoder = geocoder = new google.maps.Geocoder();

    geocoder.geocode({ 'latLng': latlng }, (results, status) => {

      if (status == google.maps.GeocoderStatus.OK) {
        if (results[1]) {
          let formatted_address = results[1]['formatted_address'].substr(0, results[1]['formatted_address'].lastIndexOf(','));
          this.setHeaderAddress(formatted_address, tempLat, tempLng);
        }
      } else {
        this.setHeaderAddress(this.environment.defaultLocationAddress, this.environment.defaultLocationLat, this.environment.defaultLocationLng);
      }
    });

  }

  /**
   * Commons chat redirection method
   * @param user_id
   * @param user_type
   */
  commonChatRedirectionMethod(user_id, user_type, pinId = 0) {
    // console.log(user_id, user_type, pinId);
    let pin_id = pinId ? pinId.toString() : '0';
    let login_user_type = parseInt(atob(localStorage.getItem('user_type')));
    let encyLoginUserId = atob(localStorage.getItem('frontend_user_id'));

    if (pin_id != '0') {
      localStorage.removeItem('doer_id');
      localStorage.removeItem('pin_id');

      localStorage.setItem('doer_id', btoa(user_id));
      localStorage.setItem('pin_id', btoa(pin_id));

      if (login_user_type == 1) {
        this.router.navigate(['/pinner/chat']);
      } else {
        this.router.navigate(['/doer/chat']);
      }
    } else {
      if (login_user_type == 1) {
        if (user_type == 1) {

          localStorage.removeItem('pin_id');
          localStorage.setItem('pin_id', btoa(pin_id));
          localStorage.removeItem('pinner_id');
          localStorage.setItem('pinner_id', btoa(user_id));
        } else {
          localStorage.removeItem('doer_id');
          localStorage.setItem('doer_id', btoa(user_id));
        }
        this.router.navigate(['/pinner/chat']);
      } else {
        var postData = {
          'pub_pinner_id': user_id,
          'pub_doer_id': encyLoginUserId,
          'pub_pin_id': 0,
          'user_type': user_type
        };

        this.myGlobals.notificationSocket.emit('save-log-last-message-data', postData);
        this.myGlobals.notificationSocket.on('get-log-last-message-data', (res) => {
          localStorage.setItem('pinner_id_again', btoa(user_id));
          this.router.navigate(['/doer/chat']);
        });
      }
    }

  }

  /**
   * Checks privacy setting by type and value
   * @param user_control
   * @param user_control_status
   * @param type
   * @returns
   */
  checkPrivacySettingByTypeAndValue(user_control, user_control_status, type) {
    let return_value = false;
    if (user_control_status == 1 || user_control_status == 2) {
      return_value = true;
    } else if (user_control == null) {
      if (user_control_status == 3) {
        if (type == 'primary_address') {
          return_value = false;
        } else {
          return_value = true;
        }
      } else if (user_control_status == 0) {
        if (type == 'first_name' || type == 'last_name' || type == 'profile_photo') {
          return_value = true;
        } else {
          return_value = false;
        }

      }
    } else {
      if (user_control_status == 3
        && (user_control[type] == 1 || user_control[type] == 4 || user_control[type] == 6 || user_control[type] == 7)) {
        return_value = true;
      } else if (user_control_status == 0
        && (user_control[type] == 3 || user_control[type] == 5 || user_control[type] == 6 || user_control[type] == 7)) {
        if (type == 'primary_address') {
          return_value = false;
        } else {
          return_value = true;
        }
      }
    }

    return return_value;
    /*  if (user_control_status == 1 || user_control_status == 2 || user_control == null
  || (user_control_status == 3
    && (user_control[type] == 1 || user_control[type] == 4 || user_control[type] == 6 || user_control[type] == 7))
  || (user_control_status == 0
    && (user_control[type] == 3 || user_control[type] == 5 || user_control[type] == 6 || user_control[type] == 7))) {
return true;
} else {
return false;
} */

  }

  /**
   * Checks setting by type and value for all
   * @param user_control
   * @param user_control_status
   * @param type
   * @returns
   */
  checkSettingByTypeAndValueForAll(user_control, user_control_status, type){
    if (user_control_status == 1 || user_control_status == 2 || user_control == null
      || (user_control_status == 3
        && (user_control[type] == 1 || user_control[type] == 4 || user_control[type] == 6 || user_control[type] == 7))
      || (user_control_status == 0
        && (user_control[type] == 3 || user_control[type] == 5 || user_control[type] == 6 || user_control[type] == 7))) {
    return true;
    } else {
    return false;
    }
  }


  privacySettingRearrange(temp_community_list) {
    if (temp_community_list.user) {
      // temp_community_list.user.user_control = null;
      temp_community_list.user.firstNameShow = this.checkPrivacySettingByTypeAndValue(temp_community_list.user.user_control, temp_community_list.user_control_status, 'first_name');

      temp_community_list.user.lastNameShow = this.checkPrivacySettingByTypeAndValue(temp_community_list.user.user_control, temp_community_list.user_control_status, 'last_name');

      temp_community_list.user.profilePictureShow = this.checkPrivacySettingByTypeAndValue(temp_community_list.user.user_control, temp_community_list.user_control_status, 'profile_photo');

      temp_community_list.user.addressShow = this.checkPrivacySettingByTypeAndValue(temp_community_list.user.user_control, temp_community_list.user_control_status, 'primary_address');
    }

    if (temp_community_list.receiver) {
      temp_community_list.receiver.firstNameShow = this.checkPrivacySettingByTypeAndValue(temp_community_list.receiver.user_control, temp_community_list.receiver.user_control_status, 'first_name');

      temp_community_list.receiver.lastNameShow = this.checkPrivacySettingByTypeAndValue(temp_community_list.receiver.user_control, temp_community_list.receiver.user_control_status, 'last_name');

      temp_community_list.receiver.profilePictureShow = this.checkPrivacySettingByTypeAndValue(temp_community_list.receiver.user_control, temp_community_list.receiver.user_control_status, 'profile_photo');

      temp_community_list.receiver.addressShow = this.checkPrivacySettingByTypeAndValue(temp_community_list.receiver.user_control, temp_community_list.receiver.user_control_status, 'primary_address');
    }

    if (temp_community_list.recomended_user) {
      temp_community_list.recomended_user.firstNameShow = this.checkPrivacySettingByTypeAndValue(temp_community_list.recomended_user.user_control, temp_community_list.recomended_user.user_control_status, 'first_name');

      temp_community_list.recomended_user.lastNameShow = this.checkPrivacySettingByTypeAndValue(temp_community_list.recomended_user.user_control, temp_community_list.recomended_user.user_control_status, 'last_name');

      temp_community_list.recomended_user.profilePictureShow = this.checkPrivacySettingByTypeAndValue(temp_community_list.recomended_user.user_control, temp_community_list.recomended_user.user_control_status, 'profile_photo');

      temp_community_list.recomended_user.addressShow = this.checkPrivacySettingByTypeAndValue(temp_community_list.recomended_user.user_control, temp_community_list.recomended_user.user_control_status, 'primary_address');
    }

    return temp_community_list;
  }

  privacySettingRearrangeComment(element) {
    element.user.firstNameShow = this.checkPrivacySettingByTypeAndValue(element.user.user_control, element.user.user_control_status, 'first_name');

    element.user.lastNameShow = this.checkPrivacySettingByTypeAndValue(element.user.user_control, element.user.user_control_status, 'last_name');

    element.user.profilePictureShow = this.checkPrivacySettingByTypeAndValue(element.user.user_control, element.user.user_control_status, 'profile_photo');
    return element;
  }

  //  badges-slider
  initBadgeSlider() {
    $(".badges-slider").each(function (index, element) {
      var thisitem = $(this);
      thisitem.addClass("instance-" + index);
      thisitem.find(".swiper-button-prev").addClass("btn-prev-" + index);
      thisitem.find(".swiper-button-next").addClass("btn-next-" + index);
      // console.log($(".instance-" + index));

      let swiper = new Swiper(".instance-" + index + ' .swiper-container', {
        slidesPerView: 3,
        spaceBetween: 0,
        navigation: {
          nextEl: ".instance-" + index + ' .btn-next-' + index,
          prevEl: ".instance-" + index + " .btn-prev-" + index,
        },
        breakpoints: {
          1024: {
            slidesPerView: 3,
            spaceBetween: 0,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 0,
          },
          640: {
            slidesPerView: 3,
            spaceBetween: 0,
          },
          320: {
            slidesPerView: 2,
            spaceBetween: 0,
          }
        }
      });

    });

  }

  /**
   * Gets orientation
   * @param file
   * @param callback
   */
  // getOrientation(file, callback) {

  //   var reader: any,
  //     target: EventTarget;
  //   reader = new FileReader();
  //   reader.onload = (event) => {

  //     var view = new DataView(event.target.result);

  //     if (view.getUint16(0, false) != 0xFFD8) return callback(-2);

  //     var length = view.byteLength,
  //       offset = 2;

  //     while (offset < length) {
  //       var marker = view.getUint16(offset, false);
  //       offset += 2;

  //       if (marker == 0xFFE1) {
  //         if (view.getUint32(offset += 2, false) != 0x45786966) {
  //           return callback(-1);
  //         }
  //         var little = view.getUint16(offset += 6, false) == 0x4949;
  //         offset += view.getUint32(offset + 4, little);
  //         var tags = view.getUint16(offset, little);
  //         offset += 2;

  //         for (var i = 0; i < tags; i++)
  //           if (view.getUint16(offset + (i * 12), little) == 0x0112)
  //             return callback(view.getUint16(offset + (i * 12) + 8, little));
  //       }
  //       else if ((marker & 0xFF00) != 0xFF00) break;
  //       else offset += view.getUint16(offset, false);
  //     }
  //     return callback(-1);
  //   };

  //   reader.readAsArrayBuffer(file.slice(0, 64 * 1024));
  // };

  /**
   * Resets orientation
   * @param srcBase64
   * @param srcOrientation
   * @param callback
   */
  // resetOrientation(srcBase64, srcOrientation, callback) {
  //   var img = new Image();

  //   img.onload = () => {
  //     var width = img.width,
  //       height = img.height,
  //       canvas = document.createElement('canvas'),
  //       ctx = canvas.getContext("2d");

  //     // set proper canvas dimensions before transform & export
  //     if (4 < srcOrientation && srcOrientation < 9) {
  //       canvas.width = height;
  //       canvas.height = width;
  //     } else {
  //       canvas.width = width;
  //       canvas.height = height;
  //     }

  //     // transform context before drawing image
  //     switch (srcOrientation) {
  //       case 2: ctx.transform(-1, 0, 0, 1, width, 0); break;
  //       case 3: ctx.transform(-1, 0, 0, -1, width, height); break;
  //       case 4: ctx.transform(1, 0, 0, -1, 0, height); break;
  //       case 5: ctx.transform(0, 1, 1, 0, 0, 0); break;
  //       case 6: ctx.transform(0, 1, -1, 0, height, 0); break;
  //       case 7: ctx.transform(0, -1, -1, 0, height, width); break;
  //       case 8: ctx.transform(0, -1, 1, 0, 0, width); break;
  //       default: break;
  //     }
  //     // draw image
  //     ctx.drawImage(img, 0, 0);
  //     console.log("CTX= ",ctx);
  //     console.log("canvas = ",canvas);
  //     console.log(".toDataURL()=",canvas.toDataURL());
  //     // export base64
  //     callback(canvas.toDataURL());
  //   };
  //   img.src = srcBase64;
  // }


  /**
   * Params common service
   * @param dataURI
   * @returns
   */
  dataURItoBlob(dataURI) {
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    //New Code
    return new Blob([ab], { type: mimeString });
  }

  /**
   * Base64s encode
   * @param value
   * @returns
   */
  base64_encode(value) {
    value = this.environment.private_key + value + this.environment.public_key;
    return btoa(value);
  }

  /**
   * Remove duplicate value based on key value pair
   * @param myArr array
   * @param prop string
   */
  removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
  }

  /**
   * Check if file is an image
   * @param fileName String
   */
  isImageFile(fileName: string) {

    if (!fileName) {
      return false;
    }

    let fileExtension = fileName.split(".").reverse()[0].toLowerCase();

    return this.allowedImageTypes.includes(fileExtension);
  }


  loginByInvitation(invitation_id: any, type: string) {
    return this.postHttpCall({ 
      url: '/accept-admin-doer-profile', 
      data: { 
        invitation_id,
        type
      }, 
      contenttype: "application/json" 
    });
  }


  setAccountDataToStorage(response) {
    localStorage.setItem('frontend_user_id', btoa(response.data.id));
    localStorage.setItem('x-access-token', response.access_token);
    localStorage.setItem('frontend_token', response.token);
    localStorage.setItem('user_type', btoa(response.data.user_type));
    localStorage.setItem('name', response.data.name);
    localStorage.setItem('user_first_name', response.data.first_name);
    localStorage.setItem('company_name', response.data.company_name);
    localStorage.setItem('user_name', response.data.username);
    localStorage.setItem('profile_type', btoa(response.data.profile_type));
    sessionStorage.setItem('show_session_expired_popup', '1');
  }


}
