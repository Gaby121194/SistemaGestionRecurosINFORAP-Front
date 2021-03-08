import { Alerta } from './alerta';
import { Servicio } from './servicio';

export interface AlertaServicio {
    servicio: Servicio;
    alertas: Alerta[];
}