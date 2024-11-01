import { ROLES, NOMBRE, NOMBRECLIENTE, CARGO } from './../_config/application';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccesoService } from '../_aods/acceso.service';
import { TOKEN } from '../_config/application';
import * as jwt_decode from 'jwt-decode';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-acceso',
  templateUrl: './acceso.component.html',
  styleUrls: ['./acceso.component.css'],
})
export class AccesoComponent implements OnInit {
  gestion: number = new Date().getFullYear();

  formulario: FormGroup;
  submitted = false;
  error = '';
  estado: boolean = false;

  intentosFallidos: number = 0;
  maxIntentos: number = 3;
  tiempoEspera: number = 30;

  constructor(
    private _fb: FormBuilder,
    private _ruta: Router,
    private _mensajes: ToastrService,
    private _accesoService: AccesoService
  ) {}

  ngOnInit() {
    this.crearformulario();
  }

  crearformulario() {
    this.formulario = this._fb.group({
      usuario: ['', Validators.required],
      clave: ['', Validators.required],
    });
  }

  get f() {
    return this.formulario.controls;
  }

  faceptar() {
    if (this.intentosFallidos >= this.maxIntentos) {
      this.mostrarCuentaRegresiva();
      return;
    }
    this.estado = true;
    this.submitted = true;
    this._accesoService
      .acceso(this.f.usuario.value, this.f.clave.value)
      .subscribe(
        (data) => {
          if (data) {
            const token = JSON.stringify(data);
            var decoded = jwt_decode(token);
            sessionStorage.setItem(ROLES, decoded['authorities']);
            sessionStorage.setItem(NOMBRE, decoded['nombre']);
            sessionStorage.setItem(NOMBRECLIENTE, decoded['nombrecliente']);
            sessionStorage.setItem(CARGO, decoded['cargo']);
            sessionStorage.setItem(TOKEN, token);
            //this._ruta.navigateByUrl('/inicio');
            swal.fire({
              title: 'Bienvenido al Sistema de Administración de la Tienda Virtual!!!',
              text: `Hola, ${decoded['nombre']} ${decoded['nombrecliente']}, has iniciado sesión con éxito.`,
              icon: 'success',
              confirmButtonText: 'Aceptar'
            }).then(() => {
              this._ruta.navigateByUrl('/inicio');
            });
            this._mensajes.success(`${decoded['nombre']} ${decoded['nombrecliente']}`, 'Bienvenido');
            this.estado = false;
            this.intentosFallidos = 0;
          }
        },
        (err) => {
          if (err.status === 0) {
            swal.fire('Verifica tu conexión!', 'Sin conexión al sistema', 'error');
          }
          if (err.status === 400) {
            this.intentosFallidos++;
            const intentosRestantes = this.maxIntentos - this.intentosFallidos;
            swal.fire('Verifica tus datos!', `Usuario o Contraseña incorrectos. Intentos restantes: ${intentosRestantes}`, 'warning');
            if (this.intentosFallidos >= this.maxIntentos) {
              this.mostrarCuentaRegresiva();
            }
          }
          this.f.usuario.setValue('');
          this.f.clave.setValue('');
          this.estado = false;
        }
      );
  }

  mostrarCuentaRegresiva() {
    let tiempoEspera = this.intentosFallidos * 30;
    let minutos: number, segundos: number;

    swal.fire({
      title: 'Demasiados intentos fallidos',
      html: `Espera <strong>${this.formatearTiempo(tiempoEspera)}</strong> minutos para volver a intentar.`,
      allowOutsideClick: false,
      showConfirmButton: false,
      onBeforeOpen: () => {
        swal.showLoading();
        const interval = setInterval(() => {
          tiempoEspera--;
          minutos = Math.floor(tiempoEspera / 60);
          segundos = tiempoEspera % 60;

          swal.getHtmlContainer().querySelector('strong')!.textContent = this.formatearTiempo(tiempoEspera);

          if (tiempoEspera <= 0) {
            clearInterval(interval);
            swal.close();
            this.intentosFallidos = 0;
          }
        }, 1000);
      },
    });
  }

  formatearTiempo(tiempoEnSegundos: number): string {
    const minutos = Math.floor(tiempoEnSegundos / 60);
    const segundos = tiempoEnSegundos % 60;
    return `${this.agregarCero(minutos)}:${this.agregarCero(segundos)}`;
  }

  agregarCero(valor: number): string {
    return valor < 10 ? '0' + valor : valor.toString();
  }
}
