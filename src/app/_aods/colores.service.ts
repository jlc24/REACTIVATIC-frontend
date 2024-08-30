import { Injectable } from '@angular/core';
import { RUTA, TOKEN } from '../_config/application';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { Colores } from '../_entidades/colores';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ColoresService {

  ruta = `${RUTA}/apirest/colores`;

  constructor( private _httpClient: HttpClient, private toast: ToastrService ) { }

  lista(id: number): Observable<Colores[]>{
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.get<Colores[]>(`${this.ruta}/${id}`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    }).pipe(
      catchError(error => {
        this.toast.error('Error al obtener la lista de Colores', 'Error');
        return throwError(() => error);
      })
    );
  }

  adicionar(color: Colores):Observable <any>{
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.post<void>(`${this.ruta}`, color, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    }).pipe(
      catchError(error => {
        this.toast.error('Error al adicionar el Color', 'Error');
        return throwError(() => error);
      })
    );
  }

  eliminar(id: number): Observable<void>{
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.delete<void>(`${this.ruta}/${id}`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    }).pipe(
      catchError(error => {
        this.toast.error('Error al eliminar el Color', 'Error');
        return throwError(() => error);
      })
    );
  }
}
