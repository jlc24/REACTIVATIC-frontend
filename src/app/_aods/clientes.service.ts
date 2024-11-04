import { Injectable } from '@angular/core';
import { RUTA, TOKEN } from '../_config/application';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Clientes } from '../_entidades/clientes';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  ruta = `${RUTA}/apirest/clientes`;

  constructor(private _httpClient: HttpClient) { }

  datos(pagina: number, cantidad: number, buscar: string): Observable<Clientes[]> {
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.get<Clientes[]>(`${this.ruta}/?pagina=${pagina}&cantidad=${cantidad}&buscar=${buscar}`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }

  cantidad(buscar: string): Observable<number> {
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.get<number>(`${this.ruta}/cantidad?buscar=${buscar}`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }

  datosl(pagina: number, cantidad: number, buscar: string, beneficio: number): Observable<Clientes[]> {
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.get<Clientes[]>(`${this.ruta}/l?pagina=${pagina}&cantidad=${cantidad}&buscar=${buscar}&beneficio=${beneficio}`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }
}
