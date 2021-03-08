import { Usuario } from './usuario';
import { Permiso } from './permiso';
import { View } from './view';

export interface AuthenticationToken {
    token : string;
    usuario : Usuario ;
    isSuperUser: boolean | null;
    permisos : Permiso[];
    views : View[];
}
