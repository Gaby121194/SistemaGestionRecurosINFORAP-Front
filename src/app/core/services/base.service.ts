import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class BaseService {
  protected headers: HttpHeaders = new HttpHeaders();
  protected APIEndpoint = environment.APIEndPoint;
  constructor(protected httpClient: HttpClient) { }

  // protected handleError(error: Response) {
  //   console.error(error);
  //   return Observable.throw(error.statusText);
  // }
}
