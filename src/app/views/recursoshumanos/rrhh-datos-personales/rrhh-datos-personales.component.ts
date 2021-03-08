import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogService } from 'src/app/shared/dialog.service';
import { RecursosHumanosService } from 'src/app/core/services/recursos-humanos.service';
import { RecursoHumanoValidator } from 'src/app/core/validators/recursohumano.validator';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { DatePipe, JsonPipe } from '@angular/common';
import { RecursoHumano } from 'src/app/core/models/recurso-humano';
import { RecursosHumanosFormComponent } from '../recursoshumanos-form/recursoshumanos-form.component';
import { MatDialog } from '@angular/material/dialog';
import { DateHelper } from 'src/app/core/helpers/date.helper';

@Component({
  selector: 'app-rrhh-datos-personales',
  templateUrl: './rrhh-datos-personales.component.html',
  styleUrls: ['./rrhh-datos-personales.component.scss']
})

export class RrhhDatosPersonalesComponent implements OnInit {

  formGroup: FormGroup;
  submitted: boolean = false;
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  button: string;
  update: boolean = false;
  isedit: boolean = false;
  item: RecursoHumano;
  recursosHumanos : RecursoHumano[];
  filteredRecursosHumanos: RecursoHumano[];

 
  constructor(private fb: FormBuilder,
    private basicService: RecursosHumanosService,
    private recursoHumanoValidator: RecursoHumanoValidator,
    private dialogService: DialogService,
    private datePipe: DatePipe,
    private dateHelper: DateHelper,
    private modalService : MatDialog,
  ) { }

  ngOnInit(): void {

      this.title = "Detalles";
      //this.subtitle = "";
      this.button = "Modificar";
      this.icon = "edit"
      this.basicService.getBy(this.id).subscribe(s => {
      this.item= s;
          
        })
      }
      
      edit(id) {
        const dialogRef = this.modalService.open(RecursosHumanosFormComponent, {
          disableClose : false,
          autoFocus : true,      
        });
        dialogRef.componentInstance.id = id;
  
        dialogRef.afterClosed().subscribe(result => {
          this.listRecursosHumanos();
        });
      }
      listRecursosHumanos(){
        this.basicService.list().subscribe(s=> this.recursosHumanos = this.filteredRecursosHumanos = s)
      }
  } 
  