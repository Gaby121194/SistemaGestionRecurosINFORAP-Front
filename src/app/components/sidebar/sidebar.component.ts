import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuUser } from 'src/app/core/models/menu-user';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { SidebarService } from 'src/app/core/services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
  items = [
    { name: 'Usuarios', icon: "people", funcion: "users"}, 
    { name: "Empresas", icon: "business", funcion: "empresas"},
    { name: "Roles", icon: "perm_contact_calendar", funcion: "roles"},
    { name: "Recursos Materiales", icon: "laptop", funcion: "recursosmateriales"},
    { name: "Recursos Humanos", icon: "people", funcion: "recursoshumanos"},
    { name: "Ubicaciones", icon: "location_on", funcion: "ubicaciones"},
    { name: "Clientes", icon: "supervisor_account", funcion: "clientes"}
  ]
  menuUser: MenuUser[];
  
  constructor(private authenticationService: AuthenticationService, private router: Router, private sidebarService : SidebarService) { }

  async ngOnInit() {   
   this.sidebarService.caller.subscribe(async ()=> await  this.loadMenuUser());
   this.sidebarService.reloadMenuItems();
  }

  loadMenuUser = async () =>  this.menuUser = await this.authenticationService.getMenuUser();
  redirect(value) {
    this.router.navigateByUrl(value);
  }
}
