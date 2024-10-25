import { Injectable } from '@angular/core';
import { RUTA, TOKEN } from '../_config/application';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Beneficiosempresas } from '../_entidades/beneficiosempresas';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class BeneficiosempresasService {

  ruta = `${RUTA}/apirest/beneficiosempresas`;

  constructor(
    private _httpClient: HttpClient
  ) { }

  datos(pagina: number, cantidad: number, buscar: string, beneficio: number): Observable<Beneficiosempresas[]>{
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.get<Beneficiosempresas[]>(`${this.ruta}?pagina=${pagina}&cantidad=${cantidad}&buscar=${buscar}&beneficio=${beneficio}`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }

  datosl(id: number): Observable<Beneficiosempresas[]>{
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.get<Beneficiosempresas[]>(`${this.ruta}/l/${id}`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }

  cantidadbeneficio(buscar: string, beneficio: number): Observable<number>{
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.get<number>(`${this.ruta}/cantidad?buscar=${buscar}&beneficio=${beneficio}`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }

  cantidad(idbeneficio: number): Observable<number>{
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.get<number>(`${this.ruta}/cantidad/${idbeneficio}`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }

  adicionar(dato: Beneficiosempresas): Observable<any>{
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.post<void>(`${this.ruta}`, dato, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    }).pipe(
      catchError(e => {
        if (e.status === 400) {
          Swal.fire('Error en los datos', 'Los datos no son correctos', 'error');
        } else if (e.status === 409) {
          const errorMsg = e.error.mensaje || 'Conflicto en los datos';
          Swal.fire('Error de Conflicto', errorMsg, 'error');
        } else if (e.status === 500) {
          Swal.fire('Error en el Servidor', 'Error al realizar la consulta en la Base de Datos', 'error');
        } else {
          Swal.fire('Error', 'Ocurrió un error desconocido', 'error');
        }
        return throwError(e);
      })
    );
  }

  beneficios(buscar: string, empresa: number): Observable<Beneficiosempresas[]>{
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.get<Beneficiosempresas[]>(`${this.ruta}/beneficios?buscar=${buscar}&empresa=${empresa}`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }

  cantidadbe(buscar: string, empresa: number): Observable<number>{
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.get<number>(`${this.ruta}/beneficios/cantidad?buscar=${buscar}&empresa=${empresa}`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }

  eliminar(dato: Beneficiosempresas): Observable<any>{
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.request<void>('delete', `${this.ruta}`, {
      body: dato,
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${access_token}`)
        .set('Content-Type', 'application/json')
    }).pipe(
      catchError(e => {
        if (e.status === 404) {
          Swal.fire('Error', 'El Enlace-Rol no existe', 'error');
        } else if (e.status === 400) {
          Swal.fire('Error de validación', 'Revisa los campos enviados', 'error');
        } else {
          Swal.fire('Error', 'Ocurrió un error al intentar eliminar el Enlace-Rol', 'error');
        }
        return throwError(e);
      })
    );
  }

  planillaReg(id: number) {
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN))
      .access_token;
    return this._httpClient.get(`${this.ruta}/planillaregistro/${id}`, {
      responseType: "blob",
      headers: new HttpHeaders()
        .set("Authorization", `bearer ${access_token}`)
        .set("Content-Type", "application/json")
    });
  }
  planillaInsc(id: number) {
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN))
      .access_token;
    return this._httpClient.get(`${this.ruta}/planillainscripcion/${id}`, {
      responseType: "blob",
      headers: new HttpHeaders()
        .set("Authorization", `bearer ${access_token}`)
        .set("Content-Type", "application/json")
    });
  }

  planillaXLS(id: number) {
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN))
      .access_token;
    return this._httpClient.get(`${this.ruta}/planillaXLS/${id}`, {
      responseType: "blob",
      headers: new HttpHeaders()
        .set("Authorization", `bearer ${access_token}`)
        .set("Content-Type", "application/json")
    });
  }

}
