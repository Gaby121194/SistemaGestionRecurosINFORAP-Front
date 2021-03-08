export class Ubicacion {
    id: number | null;
    idProvincia: number;
    departamento: string;
    localidad: string;
    calle: string;
    numero: string;
    referencia: string;
    descripcionProvincia: string;
    creationDate: string;
    idEmpresa: number | null;
}

export interface ubicacionFilter {
    name: string | null;
    idEmpresa: number | null;
    creationDateFrom: string | null;
    creationDateTo: string | null;
}