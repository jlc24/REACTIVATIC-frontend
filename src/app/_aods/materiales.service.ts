import { Injectable } from '@angular/core';
import { RUTA, TOKEN } from '../_config/application';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { Materiales } from '../_entidades/materiales';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MaterialesService {

  ruta = `${RUTA}/apirest/materiales`;

  constructor( private _httpClient: HttpClient, private _toast: ToastrService ) { }

  lista(id: number): Observable<Materiales[]>{
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.get<Materiales[]>(`${this.ruta}/${id}`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    }).pipe(
      catchError(error => {
        this._toast.error('Error al obtener la lista de Materiales', 'Error');
        return throwError(() => error);
      })
    );
  }

  adicionar(material: Materiales):Observable <any>{
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.post<void>(`${this.ruta}`, material, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    }).pipe(
      catchError(error => {
        this._toast.error('Error al adicionar el Material', 'Error');
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
        this._toast.error('Error al eliminar el Material', 'Error');
        return throwError(() => error);
      })
    );
  }
}
