import { Injectable } from '@angular/core';
import { MyEncriptyService } from './my-encripty.service';

@Injectable({
  providedIn: 'root'
})
export class MyLocalStorageService {

  constructor(private _encript: MyEncriptyService) { }

  setItem(key, value){
    localStorage.setItem(key, value);
  }

  removeItem(key){
    localStorage.removeItem(key);
  }

  setItemEncripted(key, value){
    let dataEncripty = this._encript.set(value);
    localStorage.setItem(key, dataEncripty);
  }

  getItem(key){
    return localStorage.getItem(key)
  }

  getItemEncripted(key){
    let data = localStorage.getItem(key);
    if (data) {
      let decripted = this._encript.get(data);
      return decripted;
    }else{
      return null;
    }
  
  }

}
