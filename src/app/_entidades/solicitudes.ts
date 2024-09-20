import { Empresas } from './empresas';
import { Time } from '@angular/common';
import { Solicitudesproductos } from './solicitudesproductos';
import { Clientes } from './clientes';

export class Solicitudes {
  idsolicitud: number;
  idcliente: number;
  solicitud: string;
  idempresa: number;
  cantidadProductos: number;
  estado: boolean;
  created_at: Date;
  
  empresa: Empresas;
  cliente: Clientes;
}
