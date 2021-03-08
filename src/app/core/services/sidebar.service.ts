import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  constructor() { }
  private _shared = new BehaviorSubject<any>(null);
  public caller = this._shared.asObservable();
  reloadMenuItems(confirm:boolean = true) {
    this._shared.next(confirm);
  }
}
