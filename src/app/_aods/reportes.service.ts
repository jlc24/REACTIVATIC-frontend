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

  empresasporgestion(): Observable<Reportes[]> {
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.get<Reportes[]>(`${this.ruta}/empresasporgestion`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }

  empresasporrubro(): Observable<Reportes[]> {
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.get<Reportes[]>(`${this.ruta}/empresasporrubro`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }

  empresaspormunicipio(): Observable<Reportes[]> {
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.get<Reportes[]>(`${this.ruta}/empresaspormunicipio`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }

  gestion(): Observable<Reportes[]> {
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.get<Reportes[]>(`${this.ruta}/gestion`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }
  empresasporrubrogestion(ano: number): Observable<Reportes[]> {
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.get<Reportes[]>(`${this.ruta}/empresasporrubrogestion/${ano}`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }

  empresasentienda(): Observable<Reportes[]> {
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.get<Reportes[]>(`${this.ruta}/empresasentienda`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }
}
