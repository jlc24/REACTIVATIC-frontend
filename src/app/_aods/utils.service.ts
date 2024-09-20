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

  // cifrarXOR(id: number, clave: string): string {
  //   const idString = id.toString();
  //   let resultado = '';
  //   for (let i = 0; i < idString.length; i++) {
  //     resultado += String.fromCharCode(idString.charCodeAt(i) ^ clave.charCodeAt(i % clave.length));
  //   }
  //   return Buffer.from(resultado).toString('hex'); // Convertimos a hexadecimal para mayor longitud
  // }

  // descifrarXOR(cifrado: string, clave: string): number {
  //   const cifradoString = Buffer.from(cifrado, 'hex').toString(); // Convertimos de hexadecimal
  //   let resultado = '';
  //   for (let i = 0; i < cifradoString.length; i++) {
  //     resultado += String.fromCharCode(cifradoString.charCodeAt(i) ^ clave.charCodeAt(i % clave.length));
  //   }
  //   return parseInt(resultado, 10);
  // }


}
