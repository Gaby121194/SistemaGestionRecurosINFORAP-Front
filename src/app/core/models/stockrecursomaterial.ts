import { Ubicacion } from './ubicacion';

export class StockRecursoMaterial {
    id: number | null;
    idRecursoMaterial: number | null;
    cantidadTotal: number | null;
    cantidadDisponible: number | null;
    idEmpresa: number | null;
    idUbicacion: number | null;
    creationDate: string;
    IdUbicacionNavigation : Ubicacion;
    refUbicacion: string;
}

export interface StockRecursoMaterialFilter {
    name: string;
    creationDateFrom: string | null;
    creationDateTo: string | null;
}