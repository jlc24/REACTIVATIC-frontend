import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RUTA, TOKEN } from '../_config/application';
import { Tiposdocumentos } from '../_entidades/tiposdocumentos';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class TiposdocumentosService {

  ruta = `${RUTA}/apirest/tipodocumentos`;

  constructor(private _httpClient: HttpClient) { }

  listar(pagina: number, cantidad: number, buscar: string): Observable<Tiposdocumentos[]> {
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
  }

  datos(pagina: number, cantidad: number, buscar: string): Observable<Productos[]> {
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.get<Productos[]>(`${this.ruta}/?pagina=${pagina}&cantidad=${cantidad}&buscar=${buscar}`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }
}
