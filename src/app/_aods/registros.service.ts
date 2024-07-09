import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RUTA } from '../_config/application';
import { Registros } from '../_entidades/registros';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class RegistrosService {

  ruta = `${RUTA}/WFXCYwnGZovBflrjQqlA/registros`;

  constructor(private _httpClient: HttpClient) { }

  registro(dato: Registros): Observable<any> {
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

}
