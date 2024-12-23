import { Injectable } from '@angular/core';
import { RUTA, TOKEN } from '../_config/application';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { Negocios } from '../_entidades/negocios';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class TradesService {

  ruta = `${RUTA}/apirest/negocios`;

  constructor(private _httpClient: HttpClient, private toast: ToastrService) { }

  datos(buscar: string, beneficio: number):Observable<Negocios[]>{
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.get<Negocios[]>(`${this.ruta}?buscar=${buscar}&beneficio=${beneficio}`, {
          headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }

  dato(id: number, beneficio: number): Observable<Negocios>{
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.get<Negocios>(`${this.ruta}/${id}?beneficio=${beneficio}`, {
          headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }

  cantidad(buscar: string, beneficio: number): Observable<number> {
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.get<number>(`${this.ruta}/cantidad?buscar=${buscar}&beneficio=${beneficio}`, {
          headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }

  fechas(empresa: string, beneficio: string): Observable<Negocios[]>{
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.get<Negocios[]>(`${this.ruta}/fechas?empresa=${empresa}&beneficio=${beneficio}`, {
          headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }

  horas(empresa: string, beneficio: string, fecha: Date): Observable<Negocios[]>{
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.get<Negocios[]>(`${this.ruta}/horas?empresa=${empresa}&beneficio=${beneficio}&fecha=${fecha}`, {
          headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }

  mesas(hora: string, beneficio: string, fecha: Date): Observable<Negocios[]>{
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.get<Negocios[]>(`${this.ruta}/mesas?hora=${hora}&beneficio=${beneficio}&fecha=${fecha}`, {
          headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }

  modificar(dato: any): Observable<void>{
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
