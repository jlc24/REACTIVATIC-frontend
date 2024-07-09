import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import swal from 'sweetalert2';
import { RUTA } from '../_config/application';
import { Carritos } from './../_entidades/carritos';

@Injectable({
  providedIn: 'root'
})
export class CarritosService {

  ruta = `${RUTA}/carritos`;

  constructor(private _httpClient: HttpClient) { }

  datosl(idcliente: number): Observable<Carritos[]> {
    return this._httpClient.get<Carritos[]>(`${this.ruta}/l?idcliente=${idcliente}`);
  }

  adicionar(dato: Carritos): Observable<any> {
    return this._httpClient.post<void>(`${this.ruta}`, dato).pipe(
      catchError(e => {
        if (e.status === 400 ) {
          return throwError(e);
        }
        swal.fire('Error en los datos', 'Los datos no son correctos', 'error');
        return throwError(e);
      })
    );
  }

  eliminar(dato: Carritos): Observable<any> {
    return this._httpClient.delete<void>(`${this.ruta}/${dato.idcliente}/${dato.idproducto}`);
  }

  cantidadcarrito(idcliente: number): Observable<Carritos> {
    return this._httpClient.get<Carritos>(`${this.ruta}/cantidadcarrito?idcliente=${idcliente}`);
  }
}
