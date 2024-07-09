import { PersonasService } from './../../_aods/personas.service';
import { Personas } from './../../_entidades/personas';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { UsuariosService } from 'src/app/_aods/usuarios.service';
import { Usuarios } from 'src/app/_entidades/usuarios';
import swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
})
export class UsuariosComponent implements OnInit {
  datos: Usuarios[];
  dato: Personas;

  pagina: number = 0;
  numPaginas: number = 0;
  cantidad: number = 10;
  buscar: string = '';
  total: number = 0;
  estado: string = '';

  formulario: FormGroup;
  submitted: boolean = false;

  constructor(
    private _usuariosService: UsuariosService,
    private _personasService: PersonasService,
    private _fb: FormBuilder,
    config: NgbModalConfig,
    private _modalService: NgbModal
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
    this.fdatos();
  }

  fcantidad() {
    this._usuariosService.cantidad(this.buscar).subscribe((data) => {
      this.total = data;
    });
  }

  fbuscar() {
    this.pagina = 0;
    this.fdatos();
  }

  fdatos() {
    this._usuariosService
      .datos(this.pagina, this.cantidad, this.buscar)
      .subscribe((data) => {
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

  fformulario(dato: Personas) {
    this.formulario = this._fb.group({
      primerapellido: [dato.primerapellido, [Validators.required]],
      /* segundoapellido: [dato.segundoapellido],
      primernombre: [dato.primernombre, [Validators.required]],
      segundonombre: [dato.segundonombre], */
      fechanacimiento: [dato.fechanacimiento, [Validators.required]],
      dip: [dato.dip, [Validators.required]],
      direccion: [dato.direccion, [Validators.required]],
      telefono: [
        dato.telefono,
        [Validators.required, Validators.pattern('[0-9]*')],
      ],
      celular: [
        dato.celular,
        [Validators.required, Validators.pattern('[0-9]*')],
      ],
      correo: [
        dato.correo,
        [
          Validators.required,
          Validators.pattern(
            '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'
          ),
        ],
      ],
    });
  }

  get f() {
    return this.formulario.controls;
  }

  fadicionar(content: any) {
    this.estado = 'Adicionar';
    this.dato = new Personas();
    this.fformulario(this.dato);
    this._modalService.open(content);
  }

  fmodificar(id: number, content: any) {
    this.estado = 'Modificar';
    this._personasService.dato(id).subscribe((data) => {
      this.dato = data;
      this.fformulario(this.dato);
      this._modalService.open(content);
    });
  }

  feliminar(id: number) {
    swal
      .fire({
        title: 'Estás seguro?',
        icon: 'warning',
        text: 'No podrás revertir el borrado de este dato!',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Borrar',
      })
      .then((result) => {
        if (result.value) {
          this._usuariosService.eliminar(id).subscribe((data) => {
            this.fdatos();
          });
        }
      });
  }

  faceptar(): void {
    this.submitted = true;

    this.dato.primerapellido = this.formulario.value.primerapellido.toUpperCase();
    this.dato.fechanacimiento = this.formulario.value.fechanacimiento;
    this.dato.dip = this.formulario.value.dip;
    this.dato.direccion = this.formulario.value.direccion.toUpperCase();
    this.dato.telefono = this.formulario.value.telefono;
    this.dato.celular = this.formulario.value.celular;
    this.dato.correo = this.formulario.value.correo;

    if (this.estado === 'Modificar') {
      this._personasService.modificar(this.dato).subscribe((data) => {
        this.fdatos();
        this._modalService.dismissAll();
        swal.fire('Dato modificado', 'Dato modificado con exito', 'success');
      });
    } else {
      this._personasService.adicionar4(this.dato).subscribe((data) => {
        this.fdatos();
        this._modalService.dismissAll();
        swal.fire('Dato adicionado', 'Dato modificado con exito', 'success');
      });
    }
  }

  fcancelar() {
    this._modalService.dismissAll();
  }

  fdatosXLS() {
    this._usuariosService.datosXLS(this.buscar).subscribe(data => {
      const url = window.URL.createObjectURL(data);
      const a = document.createElement("a");
      a.setAttribute("style", "display:none;");
      document.body.appendChild(a);
      a.href = url;
      a.download = "datos.xlsx";
      a.click();
      return url;
    });
  }
  fdatosPDF() {
    this._usuariosService.datosPDF(this.buscar).subscribe(data => {
      const url = window.URL.createObjectURL(data);
      const a = document.createElement("a");
      a.setAttribute("style", "display:none;");
      document.body.appendChild(a);
      a.href = url;
      a.download = "datos.pdf";
      a.click();
      return url;
    });
  }
}
