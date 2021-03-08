import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormLoginComponent } from './views/usuarios/form-login/form-login.component';
import { SharedModule } from "./shared/shared.module";
import { BasicListComponent } from './components/basic-list/basic-list.component';
import { LayoutComponent } from './views/layout/layout.component';
import { RolesListComponent } from './views/roles/roles-list/roles-list.component';
import { RolesFormComponent } from './views/roles/roles-form/roles-form.component';
import { ListEmpresasComponent } from './views/empresas/list-empresas/list-empresas.component';

import { UserListComponent } from './views/usuarios/user-list/user-list.component';
import { UserFormComponent } from './views/usuarios/user-form/user-form.component';
import { EmpresaFormComponent } from './views/empresas/form-empresa/form-empresa.component';
import { JwtInterceptor } from './core/interceptors/jwt.interceptor';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';
import { UsuariosService } from './core/services/usuarios.service';
import { RecursosmaterialesListComponent } from './views/recursosmateriales/recursosmateriales-list/recursosmateriales-list.component';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
import { FormUbicacionComponent } from './views/ubicacion/form-ubicacion/form-ubicacion.component';
import { ListUbicacionComponent } from './views/ubicacion/list-ubicacion/list-ubicacion.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AutocompleteComponent } from './components/autocomplete/autocomplete.component';
import { FormServicioComponent } from './views/servicios/form-servicio-manager/form-servicio/form-servicio.component';
import { FormServicioManagerComponent } from './views/servicios/form-servicio-manager/form-servicio-manager.component';
import { ListServicioRequisitoComponent } from './views/servicios/form-servicio-manager/servicio-requisito/list-servicio-requisito.component';
import { FormServicioRequisitoComponent } from './views/servicios/form-servicio-manager/servicio-requisito/form-servicio-requisito.component';
import { ListServicioComponent } from './views/servicios/list-servicio/list-servicio.component';
import { ListServicioRecursoComponent } from './views/servicios/form-servicio-manager/servicio-recurso/list-servicio-recurso.component';
import { RecursosrenovablesFormComponent } from './views/recursosrenovables/recursosrenovables-form/recursosrenovables-form.component';
import { RecursosRenovablesListComponent } from './views/recursosRenovables/recursosrenovables-list/recursosrenovables-list.component';
import { MatDialogModule, MatDialogConfig, MAT_DIALOG_DEFAULT_OPTIONS } from "@angular/material/dialog/";
import { DialogComponent } from './components/dialog/dialog.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormServicioRecursoComponent } from './views/servicios/form-servicio-manager/servicio-recurso/form-servicio-recurso.component';
import { AngularFireStorageModule } from "@angular/fire/storage";
import { AngularFireModule } from "@angular/fire";
import { FormRecoveryPasswordComponent } from './views/usuarios/form-login/form-recovery-password.component';
import { MatConfirmDialogComponent } from './components/mat-confirm-dialog/mat-confirm-dialog.component';
import { MatAlertDialogComponent } from './components/mat-alert-dialog/mat-alert-dialog.component';
import { UserValidator } from './core/validators/user.validator';
import { ForbidenComponent } from './views/shared/forbiden/forbiden.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DatePipe } from '@angular/common';
import { DateValidator } from './core/validators/date.validator';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { EmpresaValidator } from './core/validators/empresa.validator';
import { UbicacionValidator } from './core/validators/ubicacion.validator';
import { FormClientesComponent } from './views/clientes/form-clientes/form-clientes.component';
import { ListClientesComponent } from './views/clientes/list-clientes/list-clientes.component';
import { ClienteValidator } from './core/validators/cliente.validator';
import { ServicioValidator } from './core/validators/servicio.validator';
import { DateHelper } from './core/helpers/date.helper';
import { RecursosHumanosFormComponent } from './views/recursoshumanos/recursoshumanos-form/recursoshumanos-form.component';
import { RecursosHumanosListComponent } from './views/recursoshumanos/recursoshumanos-list/recursoshumanos-list.component';
import { RecursoHumanoValidator } from './core/validators/recursohumano.validator';
import { RolValidator } from './core/validators/rol.validator';
import { DashboardServicioComponent } from './views/servicios/list-servicio/dashboard-servicio/dashboard-servicio.component';
import { LbdModule } from './components/lbd/lbd.module';
import { StockRecursoMaterialFormComponent } from './views/recursosmateriales/stockrecursomaterial/stock-recurso-material-form.component';
import { TiposrecursosmaterialesFormComponent } from './views/recursosmateriales/tiposrecursosmateriales/tiposrecursosmateriales-form.component';
import { RecursoMaterialValidator } from './core/validators/recursomaterial.validator';
import { TipoRecursoMaterialValidator } from './core/validators/tiporecursomaterial.validator';
import { TipoRecursosRenovablesFormComponent } from './views/recursosrenovables/tipoRecursosRenovables/tipo-recursos-renovables-form/tipo-recursos-renovables-form.component';
import { TipoRecursoRenovableValidator } from './core/validators/tiporecursorenovable.validator';
import { TipoRecursosRenovablesListComponent } from './views/recursosrenovables/tipoRecursosRenovables/tipo-recursos-renovables-list/tipo-recursos-renovables-list.component';
import { FormServicioBajaComponent } from './views/servicios/form-servicio-baja/form-servicio-baja.component';
import { FormRecursosasignadosComponent } from './views/recursosasignados/form-recursosasignados/form-recursosasignados.component';
import { ListRecursosasignadosComponent } from './views/recursosasignados/list-recursosasignados/list-recursosasignados.component';
import { RrhhDatosPersonalesComponent } from './views/recursoshumanos/rrhh-datos-personales/rrhh-datos-personales.component';
import { FormManagerRecursosmaterialesComponent } from './views/recursosmateriales/form-manager-recursosmateriales/form-manager-recursosmateriales.component';
import { FormRecursosmaterialesComponent } from './views/recursosmateriales/form-manager-recursosmateriales/form-recursosmateriales/form-recursosmateriales.component';
import { ListStockRecursosmaterialesComponent } from './views/recursosmateriales/form-manager-recursosmateriales/list-stock-recursosmateriales/list-stock-recursosmateriales.component';
import { BlankComponent } from './views/shared/blank/blank.component';
import { RecursoRenovableValidator } from './core/validators/recursorenovable.validator';
import { ListAlertasComponent } from './views/alertas/list-alertas/list-alertas.component';
import { ListBackupsComponent } from './views/backups/list-backups/list-backups.component';
import { ListPermisosComponent } from './views/permisos/list-permisos/list-permisos.component';
import { FormPermisosComponent } from './views/permisos/form-permisos/form-permisos.component';
import { ListFuncionalidadComponent } from './views/funcionalidad/list-funcionalidad/list-funcionalidad.component';
import { FormFuncionalidadComponent } from './views/funcionalidad/form-funcionalidad/form-funcionalidad.component';
import { FuncionalidadValidator } from './core/validators/funcionalidad.validator';
import { PermisoValidator } from './core/validators/permiso.validator';
import { NotFoundComponent } from './views/shared/not-found/not-found.component';
 
@NgModule({
  imports: [ 
     BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    LbdModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,
    MatCheckboxModule,
    MatDialogModule,
    NgbModule.forRoot(),
    NgxPaginationModule,
    AngularFireStorageModule,
    MatProgressBarModule,
    AngularFireModule.initializeApp(
      {
        apiKey: "AIzaSyD1UPi-RwLGaF-Wywz-WY-NVdk641uS1hU",
        authDomain: "inforap-9fa14.firebaseapp.com",
        databaseURL: "https://inforap-9fa14.firebaseio.com",
        projectId: "inforap-9fa14",
        storageBucket: "inforap-9fa14.appspot.com",
        messagingSenderId: "898899647940",
        appId: "1:898899647940:web:5f34960d33538ff0095891"
      }
    ) ,
    NgHttpLoaderModule.forRoot(),
  ],
  declarations: [
    AppComponent,
    FormLoginComponent,
    LayoutComponent,
    RolesListComponent,
    RolesFormComponent,
    ListEmpresasComponent,
    TiposrecursosmaterialesFormComponent,
    UserListComponent,
    UserFormComponent,
    RecursosmaterialesListComponent,
    FormRecursosmaterialesComponent,
    EmpresaFormComponent,
    FormUbicacionComponent,
    ListUbicacionComponent,
    FormServicioComponent,
    AutocompleteComponent,
    FormServicioManagerComponent,
    RecursosrenovablesFormComponent,
    RecursosRenovablesListComponent,
    ListServicioRequisitoComponent,
    ListServicioRequisitoComponent,
    FormServicioRequisitoComponent,
    ListServicioComponent,
    ListServicioRecursoComponent,
    RecursosrenovablesFormComponent,
    RecursosRenovablesListComponent,
    DialogComponent,
    StockRecursoMaterialFormComponent,
    FormServicioRecursoComponent,
    FormRecoveryPasswordComponent,
    MatConfirmDialogComponent,
    MatAlertDialogComponent,
    ForbidenComponent,
    FormClientesComponent,
    ListClientesComponent,
    TipoRecursosRenovablesFormComponent,
    TipoRecursosRenovablesListComponent,    
    RrhhDatosPersonalesComponent,
    DashboardServicioComponent,
    RecursosHumanosFormComponent,
    RecursosHumanosListComponent,
    FormServicioBajaComponent,
    FormRecursosasignadosComponent,
    ListRecursosasignadosComponent,
    FormManagerRecursosmaterialesComponent,
    ListStockRecursosmaterialesComponent,
    FormRecursosmaterialesComponent,
    ListStockRecursosmaterialesComponent,
    FormManagerRecursosmaterialesComponent,
    BlankComponent,
    ListAlertasComponent,
    ListBackupsComponent,
    ListPermisosComponent,
    FormPermisosComponent,
    ListFuncionalidadComponent,
    FormFuncionalidadComponent,
    NotFoundComponent
  ],


  entryComponents: [
    DialogComponent,
    StockRecursoMaterialFormComponent,
    TiposrecursosmaterialesFormComponent,
    RolesFormComponent,
    MatConfirmDialogComponent,
    FormUbicacionComponent,
    FormClientesComponent,
    FormRecursosmaterialesComponent,
    FormManagerRecursosmaterialesComponent,
    ListRecursosasignadosComponent,
    FormRecursosasignadosComponent
    
  ],


  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    UserValidator,
    DateValidator,
    EmpresaValidator,
    UbicacionValidator,
    DatePipe,
    ClienteValidator,
    DateHelper,
    ServicioValidator,
    RecursoHumanoValidator,
    RecursoRenovableValidator,
    // { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}}
    RolValidator,
    RecursoMaterialValidator,
    TipoRecursoMaterialValidator,
    TipoRecursoRenovableValidator,
    RecursoMaterialValidator,
    FuncionalidadValidator,
    PermisoValidator
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
