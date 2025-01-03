import { Injectable } from '@angular/core';
import { RUTA, TOKEN } from '../_config/application';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { Asistenciasempresas } from '../_entidades/asistenciasempresas';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AsistenciasempresasService {

  ruta = `${RUTA}/apirest/asistenciasempresas`

  constructor(
    private _httpClient: HttpClient,
    private toast: ToastrService
  ) { }

  fechas(id: number): Observable<Asistenciasempresas[]>{
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.get<Asistenciasempresas[]>(`${this.ruta}/fechas/${id}`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }

  datos(id: number): Observable<Asistenciasempresas[]>{
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.get<Asistenciasempresas[]>(`${this.ruta}/${id}`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }
  modificarasistencia(dato: any): Observable<any>{
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.put<void>(`${this.ruta}`, dato, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    }).pipe(
      catchError(e => {
        if (e.status === 400) {
          Swal.fire('Error en los datos', 'Los datos no son correctos', 'error');
        } else if (e.status === 409) {
          const errorMsg = e.error.mensaje || 'Conflicto en los datos';
          Swal.fire('Error de Conflicto', errorMsg, 'error');
        } else if (e.status === 500) {
          Swal.fire('Error en el Servidor', 'Error al realizar la consulta en la Base de Datos', 'error');
        } else {
          Swal.fire('Error', 'Ocurrió un error desconocido', 'error');
        }
        return throwError(e);
      })
    );
  }
}
