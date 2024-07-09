import { ROLES, NOMBRE, NOMBRECLIENTE } from './../_config/application';
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
            sessionStorage.setItem(TOKEN, token);
            this._ruta.navigateByUrl('/escritorio');
            this._mensajes.success(decoded['nombrecliente'], 'Bienvenido');
            this.estado = false;
          }
        },
        (err) => {
          if (err.status === 0) {
            swal.fire('Verifica tu conexión!', 'Sin conexión al sistema', 'error');
          }
          if (err.status === 400) {
            swal.fire('Verifica tus datos!', 'Usuario o Contraseña incorrectos', 'warning');
          }
          this.f.usuario.setValue('');
          this.f.clave.setValue('');
          this.estado = false;
        }
      );
  }
}
