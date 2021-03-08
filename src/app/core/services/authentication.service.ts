import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Authentication } from '../models/authentication';
import { Observable, BehaviorSubject } from 'rxjs';
import { Usuario } from '../models/usuario';
import { MyLocalStorageService } from './my-local-storage.service';
import { AuthenticationToken } from '../models/token';
import { MenuUser } from '../models/menu-user';
import { Permiso } from '../models/permiso';
import { PermisoEnum } from '../enums/permiso.enum';
import { HttpClient } from '@angular/common/http';
import { View } from '../models/view';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService extends BaseService  {
  private auth_token_key: string = "Authentication_Token";
  public user: Usuario;
  public token: AuthenticationToken;
  public getLoggedUserObject = new BehaviorSubject<any>([]);
  private menuUserRoutes: MenuUser[] =
    [
      { name: 'Usuarios', icon: "people", url: "users", active: false },
      { name: "Empresas", icon: "business", url: "empresas", active: false },
      { name: "Roles", icon: "perm_contact_calendar", url: "roles", active: false },
      { name: "Clientes", icon: "groups", url: "clientes", active: false },
      { name: "Recursos Materiales", icon: "laptop", url: "recursosmateriales", active: false },
      { name: "Recursos Humanos", icon: "people", url: "recursoshumanos", active: false },
      { name: "Recursos Renovables", icon: "fire_extinguisher", url: "recursosrenovables", active: false },
      { name: "Tipos Recursos Materiales", icon: "device_hub", url: "tiposrecursosmateriales", active: false },
      { name: "Ubicaciones", icon: "location_on", url: "ubicaciones", active: false },
      { name: "Servicios", icon: "emoji_objects", url: "servicios", active: false },
      { name: "Restaurar", icon: "restore", url: "backups", active: false },


    ]


  constructor(private _localStorageService: MyLocalStorageService, protected httpClient: HttpClient) {
    super(httpClient)}

  setLoggedUser(user: Usuario) {
    this.user = user;
    this._localStorageService.setItemEncripted('User_Info', JSON.stringify(this.user));
    this.getLoggedUserObject.next(this.getLoggedUser());
  }
  setAuthenticationToken(token: AuthenticationToken) {
    this.token = token
    this._localStorageService.setItemEncripted(this.auth_token_key, JSON.stringify(this.token));
  }
  getLoggedUser() {
    this.user = JSON.parse(this._localStorageService.getItemEncripted('User_Info')) as Usuario;
    return this.user;
  }
  getAuthenticationToken() {
    this.token = JSON.parse(this._localStorageService.getItemEncripted(this.auth_token_key)) as AuthenticationToken;
    return this.token;
  }

  public  async getMenuUser(): Promise<Array<MenuUser>> {
    var tkn = this.getAuthenticationToken();
    
    if (!tkn || !tkn.permisos) return [];
    let views = await this.httpClient.get<View[]>(`${this.APIEndpoint}authentication`).toPromise();
    return views.filter(s=>s.show == true).map(s=>{
      return {
        name : s.display,
        url : s.url,
        active : s.show,
        icon : s.icon
      }
    })

    // var result = new Array<MenuUser>();
    // tkn.permisos.forEach(permiso => {
    //   switch (permiso.nombrePermiso) {
    //     case PermisoEnum.ADMIN:
    //       {
    //         this.menuUserRoutes.filter(p =>
    //           p.name.toLowerCase() == "empresas"
    //           || p.name.toLowerCase() == "usuarios"
    //           || p.name.toLowerCase() == "restaurar"
    //          // || p.name.toLowerCase() == "roles"
    //           ).forEach(k => k.active = true);
    //         break;
    //       }
    //     case PermisoEnum.MANAGER:
    //       {
    //         this.menuUserRoutes.filter(p =>
    //           p.name.toLowerCase() == "usuarios"
    //           || p.name.toLowerCase() == "roles").forEach(k => k.active = true);
    //         break;
    //       }
    //     case PermisoEnum.RRHH_USER:
    //       {
    //         this.menuUserRoutes.filter(p =>
    //           p.name.toLowerCase() == "recursos humanos").forEach(k => k.active = true);
    //         break;
    //       }
    //     case PermisoEnum.SERVICE_USER:
    //       {
    //         this.menuUserRoutes.filter(p =>
    //           p.name.toLowerCase() == "recursos materiales"
    //           || p.name.toLowerCase() == "clientes"
    //           || p.name.toLowerCase() == "servicios"
    //           || p.name.toLowerCase() == "recursos renovables"
    //           || p.name.toLowerCase() == "ubicaciones").forEach(k => k.active = true);
    //         break;
    //       }
    //     default:
    //       break;
    //   }
    // });
    // return this.menuUserRoutes.filter(p=> p.active == true);
  }
  
  public getDefaultView(){
    var tkn = this.getAuthenticationToken();
    if (!tkn || !tkn.permisos) return "login";
     if(tkn.permisos.some(s=>s.id == 1)){
      return "/empresas";
    }else if(tkn.permisos.some(s=>s.id == 2)){
      return "/users";
    }else if(tkn.permisos.some(s=>s.id == 3)){
       return "/servicios";
    }else if(tkn.permisos.some(s=>s.id == 4)){
      return "/recursoshumanos";
    }else{
      return "/welcome"
    }

  }


  // isAdm(): boolean {

  //   this.user = new Usuario();


  //   return this.user.userProfileType.code === "ADM";
  // }

  logout() {
    this._localStorageService.removeItem('User_Info');
    this._localStorageService.removeItem(this.auth_token_key);
    this.menuUserRoutes.forEach(s=>s.active =false);
  }
}

