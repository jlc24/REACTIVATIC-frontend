import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  mostrarCargando() {
    Swal.fire({
        title: 'Cargando datos, por favor espere...',
        allowOutsideClick: false,
        onBeforeOpen: () => {
            Swal.showLoading();
        }
    });
  }

  cerrarCargando() {
    Swal.close();
  }

}
