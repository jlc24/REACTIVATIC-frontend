import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SubrubrosService } from 'src/app/_aods/subrubros.service';
import { Municipios } from 'src/app/_entidades/municipios';
import { Subrubros } from 'src/app/_entidades/subrubros';
import swal from 'sweetalert2';

@Component({
  selector: 'app-subrubros',
  templateUrl: './subrubros.component.html',
  styleUrls: ['./subrubros.component.css']
})
export class SubrubrosComponent implements OnInit {

  @Input() idrubro: number;

  datos: Subrubros[];
  dato: Subrubros;
  datosl: Municipios[];

  estado:string = '';

  formulario: FormGroup;
  submitted:boolean = false;


  constructor(
    private _subrubrosService: SubrubrosService,
    private _fb: FormBuilder,
    private _modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.fdatos(this.idrubro);
  }

  fdatos(id: number) {
    this._subrubrosService.datos(this.idrubro).subscribe((data) => {
        this.datos = data;
      });
  }

  fformulario(dato: Subrubros) {
    this.formulario = this._fb.group({
      subrubro: [dato.subrubro, [Validators.required, Validators.pattern('[a-zA-Zñ ]*')]],
    });
  }

  get f() { return this.formulario.controls; }

  fadicionar(content: any) {
    this.estado = 'Adicionar';
    this.dato = new Subrubros();
    this.dato.idrubro = this.idrubro;
    this.fformulario(this.dato);
    this._modalService.open(content);
  }

  fmodificar(id: number, content: any) {
    this.estado = 'Modificar';
    this._subrubrosService.dato(id).subscribe((data) => {
      this.dato = data;
      this.fformulario(this.dato);
      this._modalService.open(content);
    });
  }

  faceptar(): void {
    this.submitted = true;
    this.dato.subrubro = this.formulario.value.subrubro.toUpperCase();
    if (this.estado === 'Modificar') {
      this._subrubrosService.modificar(this.dato).subscribe((data) => {
        this.fdatos(this.idrubro);
        this._modalService.dismissAll();
        swal.fire('Dato modificado', 'Dato modificado con exito', 'success');
      });
    } else {
      this._subrubrosService.adicionar(this.dato).subscribe((data) => {
        this.fdatos(this.idrubro);
        this._modalService.dismissAll();
        swal.fire('Dato adicionado', 'Dato modificado con exito', 'success');
      });
    }

  }

  fcancelar() {
    this._modalService.dismissAll();
  }

}
