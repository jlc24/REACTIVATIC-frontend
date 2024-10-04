import { Injectable } from '@angular/core';
import { RUTA, TOKEN } from '../_config/application';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Beneficios } from '../_entidades/beneficios';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class BeneficiosService {

  ruta = `${RUTA}/apirest/beneficios`;

  constructor(
    private _httpClient: HttpClient,
    private toast: ToastrService
  ) { }

  datos(pagina: number, cantidad: number, buscar: string, rol: string): Observable<Beneficios[]>{
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.get<Beneficios[]>(`${this.ruta}?pagina=${pagina}&cantidad=${cantidad}&buscar=${buscar}&rol=${rol}`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }

  cantidad(buscar: string, rol: string): Observable<number>{
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.get<number>(`${this.ruta}/cantidad?buscar=${buscar}&rol=${rol}`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }

  dato(id: number): Observable<Beneficios>{
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.get<Beneficios>(`${this.ruta}/${id}`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }

  listar(id: number): Observable<Beneficios[]>{
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.get<Beneficios[]>(`${this.ruta}/rol/${id}`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }

  adicionar(dato: Beneficios): Observable<any>{
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

  modificar(dato: Beneficios): Observable<any>{
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.put<void>(`${this.ruta}`, dato, {
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

  upload(id: string, tipo: string, archivo: File): Observable<any>{
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    const formData: FormData = new FormData();
    formData.append('id', id);
    formData.append('tipo', tipo);
    formData.append('archivo', archivo);
    return this._httpClient.post<void>(`${this.ruta}/upload`, formData, {
      reportProgress: true,
      observe: 'events',
      responseType: 'json',
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`)
    }).pipe(
      catchError(e => {
        if (e.status === 400) {
          this.toast.error('No se ha seleccionado ningún archivo.', 'Error en la carga');
        } else if (e.status === 401) {
          this.toast.error('No autorizado. Por favor, inicia sesión.', 'Error de Autenticación');
        } else if (e.status === 500) {
          this.toast.error('Error al procesar el archivo en el servidor.', 'Error en el Servidor');
        } else {
          this.toast.error('Ocurrió un error desconocido.', 'Error Desconocido');
        }
        return throwError(e);
      })
    );
  }

  download(id: number, tipo: string): Observable<any>{
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.get(`${this.ruta}/downloadimage?id=${id}&tipo=${tipo}`,{
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }
}
