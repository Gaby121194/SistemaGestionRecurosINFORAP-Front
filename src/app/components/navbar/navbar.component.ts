import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/core/models/usuario';
import { MatDialog } from '@angular/material/dialog';
import { UserFormComponent } from 'src/app/views/usuarios/user-form/user-form.component';
import { EmpresaFormComponent } from 'src/app/views/empresas/form-empresa/form-empresa.component';
import { PermisoEnum } from 'src/app/core/enums/permiso.enum';
import { AlertaService } from 'src/app/core/services/alerta.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService,
    private alertService : AlertaService,
    public dialog: MatDialog,
    private cd: ChangeDetectorRef,
    private router: Router) { }
  user: Usuario;
  canEditCompany: boolean = false;
  quantity : number = 0;
 async ngOnInit() {
    this.user = this.authenticationService.getAuthenticationToken().usuario;
    let permisions = this.authenticationService.getAuthenticationToken().permisos;
    this.alertService.count().subscribe(x=>this.quantity = x.quantity);
    if (permisions) {
      this.canEditCompany = permisions.some(s => s.nombrePermiso == PermisoEnum.ADMIN || s.nombrePermiso == PermisoEnum.MANAGER)
    }
     this.cd.detectChanges();
  }
  logout() {
    this.authenticationService.logout()
    this.router.navigateByUrl("login");
  }
  edit() {
    if (this.user) {
      const dialogRef = this.dialog.open(UserFormComponent, {
        width: '50%',
        data: { id: this.user.id }
      });
      dialogRef.afterClosed().subscribe(result => { });
    }
  }

  editCompany() {
    if (this.user && this.user.idEmpresa) {
      const dialogRef = this.dialog.open(EmpresaFormComponent, {
        width: '50%'
      });
      dialogRef.componentInstance.id = this.user.idEmpresa;
      dialogRef.afterClosed().subscribe(result => { });
    }
  }
}
