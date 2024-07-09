import { Empresas } from 'src/app/_entidades/empresas';
import { AccesoService } from 'src/app/_aods/acceso.service';
import { EmpresasService } from 'src/app/_aods/empresas.service';
import { Usuarios } from './../../_entidades/usuarios';
import { UsuariosService } from './../../_aods/usuarios.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Personas } from './../../_entidades/personas';
import { PersonasService } from './../../_aods/personas.service';
import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { DomSanitizer } from '@angular/platform-browser';
import { MustMatch } from 'src/app/_config/application';

@Component({
  selector: 'app-perfiles',
  templateUrl: './perfiles.component.html',
  styleUrls: ['./perfiles.component.css']
})
export class PerfilesComponent implements OnInit {

  gestion: number = new Date().getFullYear();

  perfil: Personas;
  estado: string;
  archivoseleccionado: File;
  imagen: any;

  formulario: FormGroup;
  submitted = false;
  usuario: Usuarios;
  empresa: Empresas;

  esempresa: boolean =false;

  constructor(
    private _personasService: PersonasService,
    private _usuariosService: UsuariosService,
    private _empresasService: EmpresasService,
    private _accesoService: AccesoService,
    private _modalService: NgbModal,
    private _sanitizer: DomSanitizer,
    private _fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.fdato();
    this.fdescargar();
    this.esempresa = this._accesoService.esRolEmpresa();
    if (this.esempresa) {
      this._empresasService.perfilempresa().subscribe( data=> {
        this.empresa = data;
      })
    }
  }

  fdato() {
    this._personasService.perfil().subscribe(data=>{
      this.perfil = data;
    });
  }

  fcambiarimagen(contenido: any) {
    this.estado = 'Actualizar';
    this._modalService.open(contenido);
  }

  fseleccionarArchivo(event) {
    this.archivoseleccionado = event.target.files[0];
  }

  fcargar() {
    this._personasService.cargarImagen(this.archivoseleccionado).subscribe(data => {
      this._modalService.dismissAll();
      this.fdescargar()
      swal.fire('Archivo cargado', 'Archivo cargado con exito', 'success')
    })
  }

  fcancelar() {
    this._modalService.dismissAll();
  }

  fdescargar() {
    this.imagen = null;
    this._personasService.descargarImagen().subscribe(data=>{
      const objectURL = window.URL.createObjectURL(data);
      this.imagen = this._sanitizer.bypassSecurityTrustUrl(objectURL);
    })
  }

  fcambiarclave(contenido: any){
    this.estado = 'Actualizar';
    this.crearformulario();
    this._modalService.open(contenido);
  }

  crearformulario() {
    this.formulario = this._fb.group ({
      cclave: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]*'), Validators.minLength(8)]],
      clave: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]*'), Validators.minLength(8)]]
    },
    {
      validator: MustMatch('clave', 'cclave')
    });
  }

  get f() {
    return this.formulario.controls;
  }

  faceptarcambiarclave() {
    this.submitted = true;
    this.usuario = new Usuarios();
    this.usuario.clave = this.formulario.value.clave;
    this._usuariosService.cambiarclave(this.usuario).subscribe( data=>{
      swal.fire(
        "Dato modificado",
        "Dato modificado con exito",
        "success"
      );
      this._modalService.dismissAll();
    })
  }

}
