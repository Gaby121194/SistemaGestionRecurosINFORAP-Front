import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-login',
  templateUrl: './form-login.component.html'
})
export class FormLoginComponent implements OnInit {
  formGroup: FormGroup;
  submitted: boolean = false;
  wrongUser: boolean = false;
  constructor(private fb: FormBuilder,
    private usuarioService: UsuariosService,
    private authenticationService: AuthenticationService,
    private router: Router) { }

  ngOnInit(): void {
    this.formGroup = this.fb.group(
      {
        userName: ['', Validators.required,,Validators.email],
        password: ['', Validators.required],
      });
  }
  save() {
    if (this.formGroup.valid) {
      this.usuarioService.login(this.formGroup.value).subscribe(
        s => {
          this.authenticationService.setAuthenticationToken(s);
          var url = this.authenticationService.getDefaultView();
           this.router.navigateByUrl(url);
        }
        , err => {
           if(err == "Unauthorized"){
            this.wrongUser = true;
          }
          this.wrongUser = true;
        }
      )
    }
  }
}
