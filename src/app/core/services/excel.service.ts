import {Injectable} from '@angular/core';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { FormGroup } from '@angular/forms';
import { EstadosEnum } from '../enums/estados.enum';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  static toExportFileName(excelFileName: string): string {
    return `${excelFileName}_export_${new Date().getTime()}.xlsx`;
  }

  public exportAsExcelFile(json: any[], excelFileName: string, form : FormGroup, service : boolean = false): void {

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    //const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    this.saveAsExcelFile(excelBuffer, excelFileName, form, service);
}

  private saveAsExcelFile(buffer: any, fileName: string, form : FormGroup, service): void {
    const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
    });
    const dateParts  = new Date().toISOString().split("T")[0].split("-");
    const date = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}` 
    FileSaver.saveAs(data, fileName + this.getNombre(form, service) + " al " + `${date}` + EXCEL_EXTENSION);
}

getNombre(form : FormGroup, service : boolean){
  let nombre = "";

  if (form.controls["name"]?.value || form.controls["idEstado"]?.value || form.controls["active"]?.value || form.controls["active"]?.value == false){
    nombre += " con"
  }
  if (form.controls["name"]?.value){
    nombre += " filtro " + `'${form.controls["name"].value}',`;
  }
  if (form.controls["idEstado"]?.value){ // recursos materiales y recursos renovables
    nombre += " estado " + `'${EstadosEnum[form.controls["idEstado"]?.value]}',`
  } else if(form.controls["active"]?.value){ // empresas
    nombre += ` estado 'Habilitado,`
  } else if (form.controls["active"]?.value == false){
    nombre += " estado 'Deshabilitado',"
  }

  if(!service){
    if (form.controls["creationDateFrom"].value){
      nombre += ` desde ${form.controls["creationDateFrom"].value}`;
      service = false;
    }
    if (form.controls["creationDateTo"].value){
      nombre += ` hasta ${form.controls["creationDateTo"].value}`;
      service = false;
    }
  }
    else {
    if (form.controls["fechaInicioFrom"].value){
      nombre += ` inicio desde ${form.controls["fechaInicioFrom"].value}`;

    }
    if (form.controls["fechaInicioTo"].value){
      nombre += ` inicio hasta ${form.controls["fechaInicioTo"].value}`;

    }
    if (form.controls["fechaFinFrom"].value){
      nombre += ` fin desde ${form.controls["fechaFinFrom"].value}`;

    }
    if (form.controls["fechaFinTo"].value){
      nombre += ` fin hasta ${form.controls["fechaFinTo"].value}`;

    }
  }
  return nombre;
}

}
/* 
------EXAMPLE COMPONENT------
exportToExcel(){
    let exportdata = this.filteredUsers.map(e => {
      return {
        Fecha: e.creationDate,
        Apellido : e.apellido,
        Nombre: e.nombre,
        Email: e.email,
        Rol: e.rol,
        Empresa: e.empresa,
        }
    })
    this.excelService.exportAsExcelFile(exportdata,'Empresas');
  }
}
------EXAMPLE HTML------
<button (click)="exportToExcel()" class="btn btn-outline-success mt-3 mr-3 d-flex green" ngbPopover="Exportar a Excel" triggers="mouseenter:mouseleave" popoverClass="bg-white">
  <i class="fa fa-file-excel-o fa-2x" aria-hidden="true"></i>
</button>

*/