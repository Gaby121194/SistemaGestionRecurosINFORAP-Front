import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import * as CryptoJS from 'crypto-js';


@Injectable({
  providedIn: 'root'
})
export class MyEncriptyService {

  constructor() { }
  
   set(value){ 
     let result = CryptoJS.AES.encrypt(value, environment.encriptyKey).toString();     
    return result;
  }

  get(value){

    let result = CryptoJS.AES.decrypt(value, environment.encriptyKey).toString(CryptoJS.enc.Utf8);

    return  result;
  }

}
