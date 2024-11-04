import { Injectable } from '@angular/core';
import { RUTA, TOKEN } from '../_config/application';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Personas } from '../_entidades/personas';
import { catchError } from 'rxjs/operators';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class PersonasService {

  ruta = `${RUTA}/apirest/personas`;

  constructor(private _httpClient: HttpClient, private toastr: ToastrService) { }

  dato(id: number): Observable<Personas> {
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.get<Personas>(`${this.ruta}/${id}`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }

  persona(id: number): Observable<Personas> {
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.get<Personas>(`${this.ruta}/ver/${id}`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }

  adicionar4(dato: Personas): Observable<any> {
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.post<void>(`${this.ruta}`, dato, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    }).pipe(
      catchError(e => {
        if (e.status === 400) {
          swal.fire('Error en los datos', 'Los datos no son correctos', 'error');
        } else if (e.status === 409) {
          const errorMsg = e.error.mensaje || 'Conflicto en los datos';
          swal.fire('Error de Conflicto', errorMsg, 'error');
        } else if (e.status === 500) {
          swal.fire('Error en el Servidor', 'Error al realizar la consulta en la Base de Datos', 'error');
        } else {
          swal.fire('Error', 'Ocurrió un error desconocido', 'error');
        }
        return throwError(e);
      })
    );
  }

  modificar(dato: Personas): Observable<any> {
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.put<void>(`${this.ruta}`, dato, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    }).pipe(
      catchError(e => {
        if (e.status === 400) {
          swal.fire('Error en los datos', 'Los datos no son correctos', 'error');
        } else if (e.status === 409) {
          const errorMsg = e.error.mensaje || 'Conflicto en los datos';
          swal.fire('Error de Conflicto', errorMsg, 'error');
        } else if (e.status === 500) {
          swal.fire('Error en el Servidor', 'Error al realizar la consulta en la Base de Datos', 'error');
        } else {
          swal.fire('Error', 'Ocurrió un error desconocido', 'error');
        }
        return throwError(e);
      })
    );
  }

  perfil(): Observable<Personas> {
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.get<Personas>(`${this.ruta}/perfil`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }

  cargarImagen(archivo: File): Observable<any>{
    const formData: FormData = new FormData();
    formData.append('archivo', archivo);
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.post<void>(`${this.ruta}/cargar/`, formData, {
      reportProgress: true,
      responseType: 'json',
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`)
    });
  }

  uploadperfil(archivo: File, tipo: string): Observable<any>{
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    const formData: FormData = new FormData();
    formData.append('archivo', archivo);
    formData.append('tipo', tipo);
    return this._httpClient.post<void>(`${this.ruta}/uploadperfil`, formData, {
      reportProgress: true,
      observe: 'events',
      responseType: 'json',
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`)
    }).pipe(
      catchError(e => {
        if (e.status === 400) {
          this.toastr.error('No se ha seleccionado ningún archivo.', 'Error en la carga');
        } else if (e.status === 401) {
          this.toastr.error('No autorizado. Por favor, inicia sesión.', 'Error de Autenticación');
        } else if (e.status === 500) {
          this.toastr.error('Error al procesar el archivo en el servidor.', 'Error en el Servidor');
        } else {
          this.toastr.error('Ocurrió un error desconocido.', 'Error Desconocido');
        }
        return throwError(e);
      })
    );
  }

  downloadperfil(tipo: string): Observable<any>{
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.get(`${this.ruta}/downloadimage?tipo=${tipo}`,{
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
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
          this.toastr.error('No se ha seleccionado ningún archivo.', 'Error en la carga');
        } else if (e.status === 401) {
          this.toastr.error('No autorizado. Por favor, inicia sesión.', 'Error de Autenticación');
        } else if (e.status === 500) {
          this.toastr.error('Error al procesar el archivo en el servidor.', 'Error en el Servidor');
        } else {
          this.toastr.error('Ocurrió un error desconocido.', 'Error Desconocido');
        }
        return throwError(e);
      })
    );
  }

  descargarImagen() {
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.get(`${this.ruta}/descargar/`, {
      responseType: 'blob',
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`)
    });
  }

  download(id: number, tipo: string): Observable<any>{
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.get(`${this.ruta}/download?id=${id}&tipo=${tipo}`,{
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }

  adicionar2(dato: Personas): Observable<any> {
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.post<void>(`${this.ruta}/adicionarrep`, dato, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    }).pipe(
      catchError(e => {
        if (e.status === 400) {
          swal.fire('Error en los datos', 'Los datos no son correctos', 'error');
        } else if (e.status === 409) {
          const errorMsg = e.error.mensaje || 'Conflicto en los datos';
          swal.fire('Error de Conflicto', errorMsg, 'error');
        } else if (e.status === 500) {
          swal.fire('Error en el Servidor', 'Error al realizar la consulta en la Base de Datos', 'error');
        } else {
          swal.fire('Error', 'Ocurrió un error desconocido', 'error');
        }
        return throwError(e);
      })
    );
  }
  adicionarCli(dato: Personas): Observable<any> {
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.post<void>(`${this.ruta}/adicionarcli`, dato, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    }).pipe(
      catchError(e => {
        if (e.status === 400) {
          swal.fire('Error en los datos', 'Los datos no son correctos', 'error');
        } else if (e.status === 409) {
          const errorMsg = e.error.mensaje || 'Conflicto en los datos';
          swal.fire('Error de Conflicto', errorMsg, 'error');
        } else if (e.status === 500) {
          swal.fire('Error en el Servidor', 'Error al realizar la consulta en la Base de Datos', 'error');
        } else {
          swal.fire('Error', 'Ocurrió un error desconocido', 'error');
        }
        return throwError(e);
      })
    );
  }

  obtenerpersonasRol(id: number): Observable<Personas[]>{
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.get<Personas[]>(`${this.ruta}/roles/${id}`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }

  cambiarestado(dato: { idpersona: number, estado: boolean }): Observable<any> {
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.put<void>(`${this.ruta}/cambiarestado`, dato, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    }).pipe(
      catchError(e => {
        if (e.status === 400) {
          swal.fire('Error en los datos', 'Los datos no son correctos', 'error');
        } else if (e.status === 409) {
          const errorMsg = e.error.mensaje || 'Conflicto en los datos';
          swal.fire('Error de Conflicto', errorMsg, 'error');
        } else if (e.status === 500) {
          swal.fire('Error en el Servidor', 'Error al realizar la consulta en la Base de Datos', 'error');
        } else {
          swal.fire('Error', 'Ocurrió un error desconocido', 'error');
        }
        return throwError(e);
      })
    )
  }

  generar(dato: { id: number }): Observable<any>{
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.post<void>(`${this.ruta}/generarusuario`, dato, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }

  documentoPDF(id: number, doc: string): Observable<any>{
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    if (doc == 'carnet') {
      return this._httpClient.get(`${this.ruta}/carnet/${id}`, {
        responseType: "blob",
        headers: new HttpHeaders()
          .set("Authorization", `bearer ${access_token}`)
          .set("Content-Type", "application/json")
      });
    }
    if (doc == 'formulario') {
      return this._httpClient.get(`${this.ruta}/formulario/${id}`, {
        responseType: "blob",
        headers: new HttpHeaders()
          .set("Authorization", `bearer ${access_token}`)
          .set("Content-Type", "application/json")
      });
    }
  }
}
