import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService{
  constructor() {   
  }
  private _shared = new BehaviorSubject<any>(null);
  public currentShare = this._shared.asObservable();
  set(data: any) {
    this._shared.next(data);
  }
}