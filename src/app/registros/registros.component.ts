import { RegistrosService } from './../_aods/registros.service';
import { Registros } from './../_entidades/registros';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-registros',
  templateUrl: './registros.component.html',
  styleUrls: ['./registros.component.css']
})
export class RegistrosComponent implements OnInit {

  formulario: FormGroup;
  submitted = false;
  estadoboton: Boolean;



  registronuevo: Registros;

  constructor(
    private _fb: FormBuilder,
    private _registrosService: RegistrosService,
    private _ruta: Router
  ) { }

  ngOnInit(): void {
    this.fnuevo();
  }

  fnuevo(){
    this.registronuevo = new Registros();
    this.registronuevo.primernombre = '';
    this.registronuevo.segundonombre = '';
    this.registronuevo.primerapellido = '';
    this.registronuevo.segundoapellido = '';
    this.registronuevo.dip = '';
    this.registronuevo.celular = '';
    this.registronuevo.correo = '';
    this.crearformulario(this.registronuevo);
  }

  crearformulario(dato: Registros) {
    this.formulario = this._fb.group({
      primernombre: [dato.primernombre, [Validators.required]],
      celular: [dato.celular, [Validators.required]],
      correo : [dato.correo, [Validators.required]]
    });
  }

  get f() {
    return this.formulario.controls;
  }


  faceptar(){
    this.submitted = true;
    this.estadoboton = true;
    this.registronuevo.primernombre = this.formulario.value.primernombre.toUpperCase();
    this.registronuevo.celular = this.formulario.value.celular;
    this.registronuevo.correo = this.formulario.value.correo;
    this._registrosService.registro(this.registronuevo).subscribe( data => {
      swal.fire('¡Datos guardados!', 'Se registro correctamente en el sistema<br>Sera redireccionado al punto de acceso para que pueda ingresar con su Número de Celular como Usuario y Clave de Acceso<b></b>Gracias...</b>', 'success');
      this._ruta.navigate(['/']);
    });
    this.estadoboton = false;
  }

}
