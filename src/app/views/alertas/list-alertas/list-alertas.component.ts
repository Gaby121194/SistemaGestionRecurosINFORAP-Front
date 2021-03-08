import { Component, OnInit } from '@angular/core';
import { AlertaService } from 'src/app/core/services/alerta.service';

@Component({
  selector: 'app-list-alertas',
  templateUrl: './list-alertas.component.html'
})
export class ListAlertasComponent implements OnInit {
  constructor(private alertaService : AlertaService) { }
  isCollapsed = false;
  isCollapsedDetails = true;
  alertas :Array<any>;
  filterAlerts : Array<any>;
  async ngOnInit(): Promise<void> {
    this.alertas= this.filterAlerts =await this.alertaService.list().toPromise();
    this.alertas.forEach(a=>{a.active= true
      a.alertas.forEach(al => {
        al.active = false
      });
    });
    this.filterAlerts.forEach(a=>{a.active= true
      a.alertas.forEach(al => {
        al.active = false
      });
    });
  }
  filter(filterValue){
    console.log(filterValue)
    if (filterValue == "") {
      this.filterAlerts = this.alertas
      return;
    }
    filterValue = filterValue.toLowerCase();
    this.filterAlerts = this.alertas.filter(
      u => {
        return u.servicio.cliente.razonSocial.toLowerCase().includes(filterValue) || u.servicio.nombre.toLowerCase().includes(filterValue)
      });
  }

}
