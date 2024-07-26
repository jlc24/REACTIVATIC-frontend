import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RUTA, TOKEN } from '../_config/application';
import { Productos } from '../_entidades/productos';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  ruta = `${RUTA}/apirest/productos`;

  constructor(private _httpClient: HttpClient) { }

  datos(pagina: number, cantidad: number, buscar: string): Observable<Productos[]> {
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.get<Productos[]>(`${this.ruta}/?pagina=${pagina}&cantidad=${cantidad}&buscar=${buscar}`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }

  cantidad(buscar: string): Observable<number> {
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.get<number>(`${this.ruta}/cantidad?buscar=${buscar}`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }

  cantidadtotal(buscar: string): Observable<number> {
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.get<number>(`${this.ruta}/cantidadtotal?buscar=${buscar}`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }

  dato(id: number): Observable<Productos> {
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.get<Productos>(`${this.ruta}/${id}`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }

  adicionar(dato: Productos): Observable<any> {
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.post<void>(`${this.ruta}`, dato, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    }).pipe(
      catchError(e => {
        if (e.status === 400 ) {
          return throwError(e);
        }
        swal.fire('Error en los datos', 'Los datos no son correctos', 'error');
        return throwError(e);
      })
    );
  }

  modificar(dato: Productos): Observable<any> {
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.put<void>(`${this.ruta}`, dato, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    }).pipe(
      catchError(e => {
        if (e.status === 400 ) {
          return throwError(e);
        }
        swal.fire('Error en los datos', 'Los datos no son correctos', 'error');
        return throwError(e);
      })
    );
  }

  cargarImagenp(archivo: File, id: number): Observable<any>{
    const formData: FormData = new FormData();
    formData.append('archivo', archivo);
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.post<void>(`${this.ruta}/cargarp/${id}`, formData, {
      reportProgress: true,
      responseType: 'json',
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`)
    });
  }

  descargarproducto(id: number) {
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.get(`${this.ruta}/descargarproducto/${id}`, {
      responseType: 'blob',
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`)
    });
  }

  eliminarImagenp(id: number): Observable<any>{
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.delete<void>(`${this.ruta}/eliminarp/${id}`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }

}
