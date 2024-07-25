import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RUTA, TOKEN } from '../_config/application';
import { Tiposgeneros } from '../_entidades/tiposgeneros';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class TiposgenerosService {

  ruta = `${RUTA}/apirest/tiposgeneros`;

  constructor(private _httpClient: HttpClient) { }

  listar(): Observable<Tiposgeneros[]>{
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.get<Tiposgeneros[]> (`${this.ruta}`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }
}
