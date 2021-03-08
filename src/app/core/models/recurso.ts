import { Estado } from './estado';
import { Ubicacion } from './ubicacion';

export class Recurso {
    id: number | null;
    descripcion: string | null;
    fechaAlta: Date | null;
    fechaBaja: Date | null;
    idEmpresa: number | null
    idTipoRecurso: number
    idUbicacion: number | null
    idEstado: number | null
    creationDate: string | null;
    idEstadoNavigation: Estado | null;
    idUbicacionNavigation: Ubicacion | null;
}
