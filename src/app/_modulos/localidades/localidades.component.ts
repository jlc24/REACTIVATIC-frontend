import { Municipios } from './../../_entidades/municipios';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocalidadesService } from 'src/app/_aods/localidades.service';
import { Localidades } from 'src/app/_entidades/localidades';
import swal from 'sweetalert2';

@Component({
  selector: 'app-localidades',
  templateUrl: './localidades.component.html',
  styleUrls: ['./localidades.component.css']
})
export class LocalidadesComponent implements OnInit {

  @Input() idmunicipio: number;

  datos: Localidades[];
  dato: Localidades;
  datosl: Municipios[];

  estado:string = '';

  formulario: FormGroup;
  submitted:boolean = false;


  constructor(
    private _localidadesService: LocalidadesService,
    private _fb: FormBuilder,
    private _modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.fdatos(this.idmunicipio);
  }

  fdatos(id: number) {
    this._localidadesService.datos(this.idmunicipio).subscribe((data) => {
        this.datos = data;
      });
  }

  fformulario(dato: Localidades) {
    this.formulario = this._fb.group({
      localidad: [dato.localidad, [Validators.required, Validators.pattern('[a-zA-Zñ ]*')]],
    });
  }

  get f() { return this.formulario.controls; }

  fadicionar(content: any) {
    this.estado = 'Adicionar';
    this.dato = new Localidades();
    this.dato.idmunicipio = this.idmunicipio;
    this.fformulario(this.dato);
    this._modalService.open(content);
  }

  fmodificar(id: number, content: any) {
    this.estado = 'Modificar';
    this._localidadesService.dato(id).subscribe((data) => {
      this.dato = data;
      this.fformulario(this.dato);
      this._modalService.open(content);
    });
  }

  faceptar(): void {
    this.submitted = true;
    this.dato.localidad = this.formulario.value.localidad.toUpperCase();
    if (this.estado === 'Modificar') {
      this._localidadesService.modificar(this.dato).subscribe((data) => {
        this.fdatos(this.idmunicipio);
        this._modalService.dismissAll();
        swal.fire('Dato modificado', 'Dato modificado con exito', 'success');
      });
    } else {
      this._localidadesService.adicionar(this.dato).subscribe((data) => {
        this.fdatos(this.idmunicipio);
        this._modalService.dismissAll();
        swal.fire('Dato adicionado', 'Dato modificado con exito', 'success');
      });
    }

  }

  fcancelar() {
    this._modalService.dismissAll();
  }

}
