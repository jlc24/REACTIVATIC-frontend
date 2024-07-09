import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PersonasService } from 'src/app/_aods/personas.service';
import { RepresentantesService } from 'src/app/_aods/representantes.service';
import { UsuariosService } from 'src/app/_aods/usuarios.service';
import { Personas } from 'src/app/_entidades/personas';
import { Usuarios } from 'src/app/_entidades/usuarios';
import swal from 'sweetalert2';

@Component({
  selector: 'app-representantes',
  templateUrl: './representantes.component.html',
  styleUrls: ['./representantes.component.css']
})
export class RepresentantesComponent implements OnInit {

  datos: Usuarios[];
  dato: Personas;

  pagina:number = 0;
  numPaginas:number = 0;
  cantidad:number = 10;
  buscar:string = '';
  total:number = 0;
  estado:string = '';

  formulario: FormGroup;
  submitted:boolean = false;


  constructor(
    private _usuariosService: UsuariosService,
    private _personasService: PersonasService,
    private _representantesService: RepresentantesService,
    private _fb: FormBuilder,
    private _modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.fdatos();
  }


  fcantidad() {
    this._usuariosService.cantidadrep(this.buscar).subscribe((data) => {
      this.total = data;
    });
  }

  fbuscar() {
    this.pagina = 0;
    this.fdatos();
  }

  fdatos() {
    this._usuariosService.datosrep(this.pagina, this.cantidad, this.buscar).subscribe((data) => {
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
      fechanacimiento: [dato.fechanacimiento, [Validators.required]],
      dip: [dato.dip, [Validators.required]]
    });
  }

  get f() { return this.formulario.controls; }

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

  faceptar(): void {
    this.submitted = true;

    this.dato.primerapellido = this.formulario.value.primerapellido.toUpperCase();
    this.dato.fechanacimiento = this.formulario.value.fechanacimiento;
    this.dato.dip = this.formulario.value.dip;
    if (this.estado === 'Modificar') {
      this._personasService.modificar(this.dato).subscribe((data) => {
        this.fdatos();
        this._modalService.dismissAll();
        swal.fire('Dato modificado', 'Dato modificado con exito', 'success');
      });
    } else {
      this._personasService.adicionar2(this.dato).subscribe((data) => {
        this.fdatos();
        this._modalService.dismissAll();
        swal.fire('Dato adicionado', 'Dato modificado con exito', 'success');
      });
    }
  }

  fcancelar() {
    this._modalService.dismissAll();
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
          this._usuariosService.eliminarrep(id).subscribe((data) => {
            this.fdatos();
          });
        }
      });
  }

  fdatosXLS() {
    this._representantesService.datosXLS(this.buscar).subscribe(data => {
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
    this._representantesService.datosPDF(this.buscar).subscribe(data => {
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
