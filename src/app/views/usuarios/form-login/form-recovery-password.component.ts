import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-recovery-password',
  templateUrl: './form-recovery-password.component.html'
})
export class FormRecoveryPasswordComponent implements OnInit {
  formGroup: FormGroup;
  submitted: boolean = false;
  showSuccess: boolean =false;
  constructor(private fb: FormBuilder,
    private usuarioService: UsuariosService,
    private authenticationService: AuthenticationService,
    private router: Router) { }

  ngOnInit(): void {
    this.formGroup = this.fb.group(
      {
        userName: ['', [Validators.required,Validators.email]],     
      });
  }
  save() {
    if (this.formGroup.valid) {
      var ctrl = this.formGroup.controls["userName"];
      if(ctrl){
        this.usuarioService.recoveryPassword(ctrl.value).subscribe(
          () => {
             this.showSuccess =true;
          }
          , err => {             
          }
        )
      }
    
    }
  }
}
