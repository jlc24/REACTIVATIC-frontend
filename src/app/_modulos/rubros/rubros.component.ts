import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RubrosService } from './../../_aods/rubros.service';
import { Rubros } from './../../_entidades/rubros';
import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';

@Component({
  selector: 'app-rubros',
  templateUrl: './rubros.component.html',
  styleUrls: ['./rubros.component.css']
})
export class RubrosComponent implements OnInit {

  datos: Rubros[];
  dato: Rubros;

  pagina:number = 0;
  numPaginas:number = 0;
  cantidad:number = 10;
  buscar:string = '';
  total:number = 0;
  estado:string = '';

  formulario: FormGroup;
  submitted:boolean = false;


  constructor(
    private _rubrosService: RubrosService,
    private _fb: FormBuilder,
    private _modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.fdatos();
  }

  fcantidad() {
    this._rubrosService.cantidad(this.buscar).subscribe((data) => {
      this.total = data;
    });
  }

  fbuscar() {
    this.pagina = 0;
    this.fdatos();
  }

  fdatos() {
    this._rubrosService.datos(this.pagina, this.cantidad, this.buscar).subscribe((data) => {
        this.fcantidad();
        this.datos = data;
      });
  }

  limpiar() {
    this.pagina = 0;
    this.buscar = '';
    this.fdatos();
  }

  mostrarMas(evento: any) {
    this.pagina = evento;
    this.fdatos();
  }

  fformulario(dato: Rubros) {
    this.formulario = this._fb.group({
      rubro: [dato.rubro, [Validators.required]],
    });
  }

  get f() { return this.formulario.controls; }

  fadicionar(content: any) {
    this.estado = 'Adicionar';
    this.dato = new Rubros();
    this.fformulario(this.dato);
    this._modalService.open(content);
  }

  fmodificar(id: number, content: any) {
    this.estado = 'Modificar';
    this._rubrosService.dato(id).subscribe((data) => {
      this.dato = data;
      this.fformulario(this.dato);
      this._modalService.open(content);
    });
  }

  faceptar(): void {
    this.submitted = true;
    this.dato.rubro = this.formulario.value.rubro.toUpperCase();
    if (this.estado === 'Modificar') {
      this._rubrosService.modificar(this.dato).subscribe((data) => {
        this.fdatos();
        this._modalService.dismissAll();
        swal.fire('Dato modificado', 'Dato modificado con exito', 'success');
      });
    } else {
      this._rubrosService.adicionar(this.dato).subscribe((data) => {
        this.fdatos();
        this._modalService.dismissAll();
        swal.fire('Dato adicionado', 'Dato modificado con exito', 'success');
      });
    }

  }

  fcancelar() {
    this._modalService.dismissAll();
  }

}
