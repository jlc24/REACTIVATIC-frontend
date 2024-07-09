import { Carritos } from './../_entidades/carritos';
import { RUTA, TOKEN } from './../_config/application';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rubros } from '../_entidades/rubros';

@Injectable({
  providedIn: 'root'
})
export class SeguimientoService {

  ruta = `${RUTA}/apirest/seguimiento`;

  constructor(private _httpClient: HttpClient) { }

  datos(pagina: number, cantidad: number, buscar: string): Observable<Carritos[]> {
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.get<Carritos[]>(`${this.ruta}/?pagina=${pagina}&cantidad=${cantidad}&buscar=${buscar}`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }

  cantidad(buscar: string): Observable<number> {
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.get<number>(`${this.ruta}/cantidad?buscar=${buscar}`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }

  datosPDF(buscar: string) {
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN))
      .access_token;
    return this._httpClient.get(`${this.ruta}/datosPDF?&buscar=${buscar}`, {
      responseType: "blob",
      headers: new HttpHeaders()
        .set("Authorization", `bearer ${access_token}`)
        .set("Content-Type", "application/json")
    });
  }

  datosXLS(buscar: string) {
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN))
      .access_token;
    return this._httpClient.get(`${this.ruta}/datosXLS?&buscar=${buscar}`, {
      responseType: "blob",
      headers: new HttpHeaders()
        .set("Authorization", `bearer ${access_token}`)
        .set("Content-Type", "application/json")
    });
  }

}
