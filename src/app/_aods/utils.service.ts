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

  cifrarId(id: number): string {
    const claveSecreta = 'Re4ct!v4T¡C';
    const idConClave = `${id}-${claveSecreta}`;
    return btoa(idConClave)
  }

  descifrarId(cifrado: string): number {
    const claveSecreta = 'Re4ct!v4T¡C';
    const decodificado = atob(cifrado);
    const [id, clave] = decodificado.split('-');

    if (clave === claveSecreta) {
      return parseInt(id, 10);
    } else {
      throw new Error('Clave secreta no coincide');
    }
    //return parseInt(atob(cifrado));
  }

}
