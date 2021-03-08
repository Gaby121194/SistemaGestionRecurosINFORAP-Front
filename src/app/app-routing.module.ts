import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormLoginComponent } from './views/usuarios/form-login/form-login.component';
import { LayoutComponent } from './views/layout/layout.component';
import { RolesListComponent } from "./views/roles/roles-list/roles-list.component";
import { ListEmpresasComponent} from './views/empresas/list-empresas/list-empresas.component';
import { UserListComponent } from './views/usuarios/user-list/user-list.component';
import { UserFormComponent } from './views/usuarios/user-form/user-form.component';
import { AuthGuard } from './core/helpers/auth.guard';
import { RecursosmaterialesListComponent } from "./views/recursosmateriales/recursosmateriales-list/recursosmateriales-list.component";

import { RecursosHumanosListComponent } from "./views/recursoshumanos/recursoshumanos-list/recursoshumanos-list.component";
import { RecursosHumanosFormComponent } from "./views/recursoshumanos/recursoshumanos-form/recursoshumanos-form.component";

import { ListUbicacionComponent } from "./views/ubicacion/list-ubicacion/list-ubicacion.component";
import { FormServicioManagerComponent } from './views/servicios/form-servicio-manager/form-servicio-manager.component';
import { RecursosrenovablesFormComponent } from './views/recursosrenovables/recursosrenovables-form/recursosrenovables-form.component';
import { RecursosRenovablesListComponent } from './views/recursosRenovables/recursosrenovables-list/recursosrenovables-list.component';
import { FormRecoveryPasswordComponent } from './views/usuarios/form-login/form-recovery-password.component';
import { ForbidenComponent } from './views/shared/forbiden/forbiden.component';
import { ListClientesComponent } from './views/clientes/list-clientes/list-clientes.component';
import { ListServicioComponent } from './views/servicios/list-servicio/list-servicio.component';
import { TipoRecursosRenovablesFormComponent } from './views/recursosrenovables/tipoRecursosRenovables/tipo-recursos-renovables-form/tipo-recursos-renovables-form.component';
import { TipoRecursosRenovablesListComponent } from './views/recursosrenovables/tipoRecursosRenovables/tipo-recursos-renovables-list/tipo-recursos-renovables-list.component';
import { FormRecursosmaterialesComponent } from './views/recursosmateriales/form-manager-recursosmateriales/form-recursosmateriales/form-recursosmateriales.component';
import { FormManagerRecursosmaterialesComponent } from './views/recursosmateriales/form-manager-recursosmateriales/form-manager-recursosmateriales.component';
import { BlankComponent } from './views/shared/blank/blank.component';
import { ListAlertasComponent } from './views/alertas/list-alertas/list-alertas.component';
import { ListBackupsComponent } from './views/backups/list-backups/list-backups.component';
import { ListFuncionalidadComponent } from './views/funcionalidad/list-funcionalidad/list-funcionalidad.component';
import { ListPermisosComponent } from './views/permisos/list-permisos/list-permisos.component';
import { NotFoundComponent } from './views/shared/not-found/not-found.component';

const routes: Routes = [
  { path: 'login', component: FormLoginComponent },
  { path: 'recovery-password', component: FormRecoveryPasswordComponent },
  {
    path: '', component: LayoutComponent, canActivate :  [AuthGuard],
    children: [
      //{ path: '', component: UserListComponent, pathMatch: 'full' },
      { path: '', component: BlankComponent, pathMatch: 'full' },
      { path: 'welcome', component: BlankComponent },
      { path: 'users', component: UserListComponent },
      { path: 'user/:id', component: UserFormComponent },
      { path: 'user', component: UserFormComponent },
      { path: 'empresas', component: ListEmpresasComponent},
      { path: 'recursosmateriales', component: RecursosmaterialesListComponent},

      { path: 'tiporecursosrenovables', component: TipoRecursosRenovablesListComponent},

      { path: 'roles', component: RolesListComponent},
      { path: 'ubicaciones', component: ListUbicacionComponent },
      { path: 'clientes', component: ListClientesComponent },
      
      { path: 'recursosmateriales', component: RecursosmaterialesListComponent},
      { path: 'recursosmateriales/:id', component: FormManagerRecursosmaterialesComponent},
      { path: 'create-recursosmateriales', component: FormRecursosmaterialesComponent},
      
      { path: 'recursoshumanos', component: RecursosHumanosListComponent},
      { path: 'recursoshumanos/:id', component: RecursosHumanosFormComponent},
      { path: 'create-recursoshumanos', component: RecursosHumanosFormComponent},
      
      { path: 'recursosrenovables', component: RecursosRenovablesListComponent},
      { path: 'create-recursosrenovables', component: RecursosrenovablesFormComponent},
      { path: 'create-recursosrenovables/:id', component: RecursosrenovablesFormComponent},
      
      
      { path: 'servicios', component: ListServicioComponent },
      { path: 'servicio', component: FormServicioManagerComponent },
      { path: 'alertas', component: ListAlertasComponent },
      { path: 'backups', component: ListBackupsComponent },
      { path: 'views', component: ListFuncionalidadComponent },
      { path: 'permisos', component: ListPermisosComponent },
   
      { path: '403-forbiden', component: ForbidenComponent },
      { path: '404-not-found', component: NotFoundComponent },     
    ]
  },
  {path: '**',component: NotFoundComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
