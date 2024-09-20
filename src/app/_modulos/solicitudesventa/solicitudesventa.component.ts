import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CarritosService } from 'src/app/_aods/carritos.service';
import { SolicitudesService } from 'src/app/_aods/solicitudes.service';
import { UsuariosService } from 'src/app/_aods/usuarios.service';
import { RUTA } from 'src/app/_config/application';
import { Carritos } from 'src/app/_entidades/carritos';
import { Solicitudes } from 'src/app/_entidades/solicitudes';
import swal from 'sweetalert2';

@Component({
  selector: 'app-solicitudesventa',
  templateUrl: './solicitudesventa.component.html',
  styleUrls: ['./solicitudesventa.component.css']
})
export class SolicitudesventaComponent implements OnInit {

  rutaproducto = `${RUTA}/catalogos/descargarimagenproducto/`;

  datos: Solicitudes[];

  pagina: number = 0;
  numPaginas: number = 0;
  cantidad: number = 10;
  buscar: string = '';
  total: number = 0;
  estado: string = '';

  carritos: Carritos[];

  attempts: number = 0;
  maxAttempts: number = 3;
  lockEndTime: number = 0;
  intervalId: any;

  constructor(
    private _solicitudesService: SolicitudesService,
    private _usuariosService: UsuariosService,
    private _toast: ToastrService
  ) { }

  ngOnInit(): void {
    this.fdatos();
  }

  fcantidad() {
    this._solicitudesService.cantidade().subscribe((data) => {
      this.total = data;
    });
  }

  fdatos() {
    this._solicitudesService.datose(this.pagina, this.cantidad).subscribe((data) => {
      this.fcantidad();
      this.datos = data;
    });
  }

  fbuscar(){

  }

  mostrarMas(evento: any) {
    this.pagina = evento;
    this.fdatos();
  }

  fenviarmensaje(celular: string) {
    const ruta = 'https://api.whatsapp.com/send?phone=591' + celular + '"&text=Hola Me gustaria comunicarme contigo';
    window.open(ruta, '_blank');
  }

  factualizarestado(id: number, estado: boolean){
    swal.fire({
      title: '¿Está seguro de marcar como vendido?',
      icon: 'warning',
      text: 'El producto se marcará como vendido y el proceso será finalizado.',
      showCancelButton: true,
      cancelButtonText: 'cancelar',
      confirmButtonText: 'Vendido',
      customClass: {
        confirmButton: 'btn btn-success rounded-pill mr-3',
        cancelButton: 'btn btn-secondary rounded-pill',
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        swal.fire({
          title: 'Confirmación de clave',
          html: `
            <input id="clave-input" class="swal2-input form-control form-control-sm" placeholder="Ingrese su clave" type="password" maxlength="20">
            <div id="intentos-restantes" style="margin-top: 10px;">Intentos restantes: ${this.maxAttempts - this.attempts}</div>
          `,
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
          confirmButtonText: 'Confirmar',
          customClass: {
            confirmButton: 'btn btn-success rounded-pill mr-3',
            cancelButton: 'btn btn-secondary rounded-pill',
          },
          buttonsStyling: false,
          preConfirm: () => {
            const clave = (document.getElementById('clave-input') as HTMLInputElement).value;
            if (!clave) {
              swal.showValidationMessage('Debe ingresar una clave');
              return false;
            }
            return clave;
          }
        }).then((claveResult) => {
          if (claveResult.value) {
            this._usuariosService.verificar({ clave: claveResult.value }).subscribe(
              (verificacionResponse) => {
                let actualizasolicitud: Solicitudes = new Solicitudes();
                actualizasolicitud.idsolicitud = id;
                this._solicitudesService.actualizarestado(actualizasolicitud).subscribe( data=> {
                  this.fdatos();
                  this._toast.success('','Clave correcta.');
                  swal.fire('Solicitud finalizada', "Su solicitud finalizó con éxito", 'success');
                  this.attempts = 0;
                });
              },
              (error) => {
                this.attempts++;
                if (this.attempts >= this.maxAttempts) {
                  this._toast.error('Se bloqueron los accesos.','Intentos excedidos.');
                  this.blockUI();
                } else {
                  this._toast.error('','Clave incorrecta.');
                  this.factualizarestado(id, estado);
                }
              }
            );
          }
        });
      }
    });
  }

  blockUI() {
    const remainingTime = 30; // Tiempo de bloqueo en segundos
    this.lockEndTime = Date.now() + remainingTime * 1000; // Calcular el tiempo de desbloqueo

    swal.fire({
      title: 'Intentos excedidos',
      html: `<div>Espere <strong id="countdown">${remainingTime}</strong> segundos para intentar de nuevo.</div>`,
      allowOutsideClick: false,
      allowEscapeKey: false,
      onBeforeOpen: () => {
        swal.showLoading(); // Mostrar el ícono de carga
        this.updateCountdown(); // Actualizar el contador
      }
    });
  }

  updateCountdown() {
    const interval = 1000; // Intervalo en milisegundos
    this.intervalId = setInterval(() => {
      const now = Date.now();
      const remainingTime = Math.max(0, Math.ceil((this.lockEndTime - now) / 1000));
      if (remainingTime <= 0) {
        clearInterval(this.intervalId);
        swal.close(); // Cerrar el Swal cuando se acabe el tiempo
        this.attempts = 0; // Reiniciar el contador de intentos
      } else {
        document.getElementById('countdown').innerText = remainingTime.toString();
      }
    }, interval);
  }

}
