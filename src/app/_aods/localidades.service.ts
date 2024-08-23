import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RUTA, TOKEN } from '../_config/application';
import { Localidades } from '../_entidades/localidades';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class LocalidadesService {

  ruta = `${RUTA}/apirest/localidades`;

  constructor(private _httpClient: HttpClient) { }

  datos(id: number): Observable<Localidades[]> {
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.get<Localidades[]>(`${this.ruta}/?id=${id}`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }

  dato(id: number): Observable<Localidades> {
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.get<Localidades>(`${this.ruta}/${id}`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }

  localidades(id: number): Observable<Localidades[]>{
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.get<Localidades[]>(`${this.ruta}/municipio/${id}`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }

  adicionar(dato: Localidades): Observable<any> {
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.post<void>(`${this.ruta}`, dato, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    }).pipe(
      catchError(e => {
        if (e.status === 400) {
          swal.fire('Error en los datos', 'Los datos no son correctos', 'error');
        } else if (e.status === 409) {
          const errorMsg = e.error.mensaje || 'Conflicto en los datos';
          swal.fire('Error de Conflicto', errorMsg, 'error');
        } else if (e.status === 500) {
          swal.fire('Error en el Servidor', 'Error al realizar la consulta en la Base de Datos', 'error');
        } else {
          swal.fire('Error', 'Ocurrió un error desconocido', 'error');
        }
        return throwError(e);
      })
    );
  }

  modificar(dato: Localidades): Observable<any> {
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.put<void>(`${this.ruta}`, dato, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    }).pipe(
      catchError(e => {
        if (e.status === 400) {
          swal.fire('Error en los datos', 'Los datos no son correctos', 'error');
        } else if (e.status === 409) {
          const errorMsg = e.error.mensaje || 'Conflicto en los datos';
          swal.fire('Error de Conflicto', errorMsg, 'error');
        } else if (e.status === 500) {
          swal.fire('Error en el Servidor', 'Error al realizar la consulta en la Base de Datos', 'error');
        } else {
          swal.fire('Error', 'Ocurrió un error desconocido', 'error');
        }
        return throwError(e);
      })
    );
  }

  datosl(id: number): Observable<Localidades[]> {
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.get<Localidades[]>(`${this.ruta}/l/${id}`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }

  cambiarestado(dato: { idlocalidad: number, estado: boolean }): Observable<any>{
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.put<void>(`${this.ruta}/cambiarestado`, dato, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    })
  }
}
