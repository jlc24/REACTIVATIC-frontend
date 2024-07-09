import { RepresentantesService } from './../../_aods/representantes.service';
import { AsociacionesService } from 'src/app/_aods/asociaciones.service';
import { Representantes } from './../../_entidades/representantes';
import { Asociaciones } from './../../_entidades/asociaciones';
import { LocalidadesService } from 'src/app/_aods/localidades.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { EmpresasService } from 'src/app/_aods/empresas.service';
import { Empresas } from 'src/app/_entidades/empresas';
import swal from 'sweetalert2';
import { SubrubrosService } from 'src/app/_aods/subrubros.service';
import { Localidades } from 'src/app/_entidades/localidades';
import { Subrubros } from 'src/app/_entidades/subrubros';
import { ToastrService } from 'ngx-toastr';
import { AccesoService } from 'src/app/_aods/acceso.service';
import { RUTA } from 'src/app/_config/application';

@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.css']
})
export class EmpresasComponent implements OnInit {

  ruta = `${RUTA}/catalogos/descargarempresa/`;

  archivoseleccionado: File;

  datos: Empresas[];
  dato: Empresas;
  localidades: Localidades[];
  subrubros: Subrubros[];
  asociaciones: Asociaciones[];
  representantes: Representantes[];

  pagina:number = 0;
  numPaginas:number = 0;
  cantidad:number = 10;
  buscar:string = '';
  total:number = 0;
  estado:string = '';

  formulario: FormGroup;
  submitted: boolean = false;

  imagen: any;

  imageSrc: string;

  constructor(
    private _empresasService: EmpresasService,
    private _subrubrosService: SubrubrosService,
    private _localidadesService: LocalidadesService,
    private _representantesService: RepresentantesService,
    private _asociacionesService : AsociacionesService,
    private _fb: FormBuilder,
    private _modalService: NgbModal,
    config: NgbModalConfig,
    private _mensajes: ToastrService,
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
    /* config.size = 'lg'; */
  }

  ngOnInit(): void {
    this.fdatos();
    this.flocalidades();
    this.fsubrubros();
    this.fasociaciones();
    this.frepresentantes();
  }

  flocalidades() {
    this._localidadesService.datosl().subscribe( data => {
      this.localidades = data;
    });
  }

  fsubrubros() {
    this._subrubrosService.datosl().subscribe( data => {
      this.subrubros = data;
    });
  }

  fasociaciones() {
    this._asociacionesService.datosl().subscribe( data => {
      this.asociaciones = data;
    });
  }

  frepresentantes() {
    this._representantesService.datosl().subscribe( data => {
      this.representantes = data;
    });
  }


  fcantidad() {
    this._empresasService.cantidad(this.buscar).subscribe((data) => {
      this.total = data;
    });
  }

  fbuscar() {
    this.pagina = 0;
    this.fdatos();
  }

  fdatos() {
    this._empresasService.datos(this.pagina, this.cantidad, this.buscar).subscribe((data) => {
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

  fformulario(dato: Empresas) {
    this.formulario = this._fb.group({
      idsubrubro: [dato.idsubrubro],
      idlocalidad: [dato.idlocalidad],
      idrepresentante: [dato.idrepresentante],
      idasociacion: [dato.idasociacion],
      empresa: [dato.empresa, [Validators.required]],
      descripcion: [dato.descripcion, [Validators.required]],
      tipo: [dato.tipo, [Validators.required]],
      direccion: [dato.direccion, [Validators.required]],
      telefono: [dato.telefono, [Validators.required, Validators.pattern('[0-9]*')]],
      celular: [dato.celular, [Validators.required, Validators.pattern('[0-9]*')]],
      correo: [dato.correo, [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
      facebook: [dato.facebook],
      twitter: [dato.twitter],
      instagram: [dato.instagram],
      paginaweb: [dato.paginaweb],
      otro: [dato.otro],
      registrosenasag: [dato.registrosenasag],
    });
  }

  get f() { return this.formulario.controls; }

  fadicionar(content: any) {
    this.estado = 'Adicionar';
    this.dato = new Empresas();
    this.fformulario(this.dato);
    this._modalService.open(content);
  }

  fmodificar(id: number, content: any) {
    this.estado = 'Modificar';
    this._empresasService.dato(id).subscribe((data) => {
      this.dato = data;
      this.fformulario(this.dato);
      this._modalService.open(content);
    });
  }

  faceptar(): void {
    this.submitted = true;
    this.dato.idsubrubro = this.formulario.value.idsubrubro;
    this.dato.idlocalidad = this.formulario.value.idlocalidad;
    this.dato.idrepresentante = this.formulario.value.idrepresentante;
    this.dato.idasociacion = this.formulario.value.idasociacion;
    this.dato.empresa = this.formulario.value.empresa.toUpperCase();
    this.dato.descripcion = this.formulario.value.descripcion;
    this.dato.tipo = this.formulario.value.tipo.toUpperCase();
    this.dato.direccion = this.formulario.value.direccion.toUpperCase();
    this.dato.telefono = this.formulario.value.telefono;
    this.dato.celular = this.formulario.value.celular;
    this.dato.correo = this.formulario.value.correo;
    this.dato.facebook = this.formulario.value.facebook;
    this.dato.twitter = this.formulario.value.twitter;
    this.dato.instagram = this.formulario.value.instagram;
    this.dato.paginaweb = this.formulario.value.paginaweb;
    this.dato.otro = this.formulario.value.otro;
    this.dato.registrosenasag = this.formulario.value.registrosenasag;
    if (this.estado === 'Modificar') {
      this._empresasService.modificar(this.dato).subscribe((data) => {
        this.fcargar(this.dato.idempresa);
        this.fdatos();
        this._modalService.dismissAll();
        swal.fire('Dato modificado', 'Dato modificado con exito', 'success');
      });
    } else {
      this._empresasService.adicionar(this.dato).subscribe((data) => {
        this.fcargar(this.dato.idempresa);
        this.fdatos();
        this._modalService.dismissAll();
        swal.fire('Dato adicionado', 'Dato modificado con exito', 'success');
      });
    }

  }

  fseleccionarArchivo(event) {
    const reader = new FileReader();
    this.archivoseleccionado = event.target.files[0];
    if (event.target.files[0] && event.target.files.length) {
      const file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imageSrc = reader.result as string;
      };
    }

  }

  fcargar(id: number) {
    this._empresasService.cargarImagene(this.archivoseleccionado, id).subscribe((data) => {
      this.fdatos();
    });
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
          this._empresasService.eliminar(id).subscribe((data) => {
            this.fdatos();
          });
        }
      });
  }

  fdatosXLS() {
    this._empresasService.datosXLS(this.buscar).subscribe(data => {
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
    this._empresasService.datosPDF(this.buscar).subscribe(data => {
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

