import { Injectable } from '@angular/core';
import { RUTA, TOKEN } from '../_config/application';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Clientes } from '../_entidades/clientes';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  ruta = `${RUTA}/apirest/solicitudes`;

  constructor(private _httpClient: HttpClient) { }

  datos(pagina: number, cantidad: number): Observable<Clientes[]> {
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.get<Clientes[]>(`${this.ruta}/?pagina=${pagina}&cantidad=${cantidad}`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }
}
