import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RUTA, TOKEN } from '../_config/application';
import { Empresas } from '../_entidades/empresas';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class EmpresasService {

  ruta = `${RUTA}/apirest/empresas`;

  constructor(private _httpClient: HttpClient, private toast: ToastrService) { }

  datos(pagina: number, cantidad: number, buscar: string, rubro: string): Observable<Empresas[]> {
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.get<Empresas[]>(`${this.ruta}/?pagina=${pagina}&cantidad=${cantidad}&buscar=${buscar}&rubro=${rubro}`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }

  cantidad(buscar: string, rubro: string): Observable<number> {
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.get<number>(`${this.ruta}/cantidad?buscar=${buscar}&rubro=${rubro}`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }

  dato(id: number): Observable<Empresas> {
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.get<Empresas>(`${this.ruta}/${id}`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }

  lista(): Observable<Empresas[]>{
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.get<Empresas[]>(`${this.ruta}/l`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }

  adicionar(dato: Empresas): Observable<any> {
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

  modificar(dato: Empresas): Observable<any> {
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

  eliminar(id: number): Observable<void> {
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.delete<void>(`${this.ruta}/${id}`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }

  verificar(id: number): Observable<number>{
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.get<number>(`${this.ruta}/verificar/${id}`, {
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

  datosXLS(
    columnsemp: string[],
    columnsrub: string[],
    columnsmun: string[],
    columnsrep: string[],
    columnsper: string[],
    municipio: string,
    rubro: string,
    fecharegistro: string,
    orden: string,
    direccion: string
  ):Observable <Blob> {
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    const queryParams = new URLSearchParams({
      columnsemp: columnsemp.join(','),
      columnsrub: columnsrub.join(','),
      columnsmun: columnsmun.join(','),
      columnsrep: columnsrep.join(','),
      columnsper: columnsper.join(','),
      municipio,
      rubro,
      fecharegistro,
      orden,
      direccion
    }).toString();

    return this._httpClient.get(`${this.ruta}/reporteXLS?${queryParams}`, {
      responseType: "blob",
      headers: new HttpHeaders()
        .set("Authorization", `Bearer ${access_token}`)
        .set("Content-Type", "application/json")
    });
  }

  perfilempresa(): Observable<Empresas> {
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.get<Empresas>(`${this.ruta}/perfilempresa`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }

  cargarImagene(archivo: File, id: number): Observable<any>{
    const formData: FormData = new FormData();
    formData.append('archivo', archivo);
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.post<void>(`${this.ruta}/cargare/${id}`, formData, {
      reportProgress: true,
      responseType: 'json',
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`)
    });
  }

  descargarempresa(id: number) {
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
    return this._httpClient.get(`${this.ruta}/descargarempresa/${id}`, {
      responseType: 'blob',
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`)
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

  documentoPDF(id: number, doc: string): Observable<any>{
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN)).access_token;
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
