import { Reportes } from './../_entidades/reportes';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RUTA, TOKEN } from '../_config/application';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  ruta = `${RUTA}/apirest/reportes`;

  constructor(private _httpClient: HttpClient) { }

  empresasmassolicitadas(): Observable<Reportes[]> {
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.get<Reportes[]>(`${this.ruta}/empresasmassolicitadas`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }

  clientesconmascompras(): Observable<Reportes[]> {
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.get<Reportes[]>(`${this.ruta}/clientesconmascompras`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }

  productosmasvendidos(): Observable<Reportes[]> {
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.get<Reportes[]>(`${this.ruta}/productosmasvendidos`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }
}
