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
import { TiposdocumentosService } from 'src/app/_aods/tiposdocumentos.service';
import { TiposextensionesService } from 'src/app/_aods/tiposextensiones.service';
import { TiposgenerosService } from 'src/app/_aods/tiposgeneros.service';
import { Tiposdocumentos } from 'src/app/_entidades/tiposdocumentos';
import { Tiposextensiones } from 'src/app/_entidades/tiposextensiones';
import { Tiposgeneros } from 'src/app/_entidades/tiposgeneros';
import { RubrosService } from 'src/app/_aods/rubros.service';
import { SubrubrosService } from 'src/app/_aods/subrubros.service';
import { MunicipiosService } from 'src/app/_aods/municipios.service';
import { LocalidadesService } from 'src/app/_aods/localidades.service';
import { AsociacionesService } from 'src/app/_aods/asociaciones.service';
import { Municipios } from 'src/app/_entidades/municipios';
import { Localidades } from 'src/app/_entidades/localidades';
import { Rubros } from 'src/app/_entidades/rubros';
import { Subrubros } from 'src/app/_entidades/subrubros';
import { Asociaciones } from 'src/app/_entidades/asociaciones';

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
  formUser: FormGroup;
  formEmpresa: FormGroup;
  submitted = false;
  usuario: Usuarios;
  empresa: Empresas;

  formacionMap: { [key: number]: string } = {
    1: 'INICIAL',
    2: 'PRIMARIA',
    3: 'SECUNDARIA',
    4: 'TENICO',
    5: 'LICENCIATURA'
  };

  estadocivilMap: { [key: number]: string } = {
    1: 'SOLTERO(A)',
    2: 'CASADO(A)',
    3: 'VIUDO(A)',
    4: 'CONVIVIENTE',
    5: 'SEPARADO(A)'
  }

  hijosMap: { [key: number]: string } = {
    0: 'SIN HIJOS',
    1: '1 HIJO',
    2: '2 HIJOS',
    3: '3 HIJOS',
    4: '4 HIJOS',
    5: '5 A MAS HIJOS'
  }

  capacidadMap: { [key: number]: string} = {
    1: '1 A 2',
    2: '3 A 5',
    3: '6 A 10',
    4: '11 A 15',
    5: '16 A 25',
    6: '26 A 50',
    7: '> 50'
  }

  motivoMap: { [key: number]: string } = {
    1: 'POR INFLUENCIA FAMILIAR',
    2: 'POR EXPERIENCIA LABORAL',
    3: 'POR DESPIDO DE TRABAJO',
    4: 'POR LA DEMANDA DEL MERCADO',
    5: 'OTRO'
  }

  involucradosMap: { [key: number]: string } = {
    1: 'PAREJA',
    2: 'HIJOS',
    3: 'HERMANOS',
    4: 'PADRES',
    5: 'PRIMOS',
    6: 'OTROS'
  }

  trabajadoresMap: { [key: number]: string } = {
    1: '1 A 2',
    2: '3 A 4',
    3: '7 A 8',
    4: '9 A 10',
    5: '10 A 11',
    6: '12 A  MAS'
  }

  feriasMap: { [key: number]: string } = {
    1: 'LOCAL',
    2: 'NACIONAL',
    3: 'MUNICIPAL',
    4: 'INTERNACIONAL'
  }

  escliente: boolean =false;
  esempresa: boolean =false;
  esreactivatic: boolean =false;
  esdpeic: boolean = false;
  essddpi: boolean =false;
  esadmin: boolean =false;

  documento: Tiposdocumentos[];
  extension: Tiposextensiones[];
  genero: Tiposgeneros[];

  step: number = 1;

  municipios: Municipios[];
  localidades: Localidades[];
  rubros: Rubros[];
  subrubros: Subrubros[];
  asociaciones: Asociaciones[];

  mostrarOtroCampo = false;
  mostrarInvolucrados = false;
  mostrarOtro = false;

  constructor(
    private _personasService: PersonasService,
    private _usuariosService: UsuariosService,
    private _empresasService: EmpresasService,
    private _rubrosService: RubrosService,
    private _subrubrosService: SubrubrosService,
    private _municipiosService: MunicipiosService,
    private _localidadesService: LocalidadesService,
    private _asociacionesService : AsociacionesService,
    private _accesoService: AccesoService,
    private _documentoService: TiposdocumentosService,
    private _extensionesService: TiposextensionesService,
    private _generosService: TiposgenerosService,
    private _modalService: NgbModal,
    private _sanitizer: DomSanitizer,
    private _fb: FormBuilder,
    private _fbU: FormBuilder,
    private _fbE: FormBuilder
  ) { }

  ngOnInit(): void {
    this.escliente = this._accesoService.esRolClientes();
    this.esempresa = this._accesoService.esRolEmpresa();
    this.esreactivatic = this._accesoService.esRolReactivatic();
    this.esdpeic = this._accesoService.esRolDpeic();
    this.essddpi = this._accesoService.esRolSddpi();
    this.esadmin = this._accesoService.esRolAdmin();
    this.fdato();
    // this.fdescargar();
    this.fdocumento();
    this.fextension();
    this.fgenero();
    this.esempresa = this._accesoService.esRolEmpresa();
    if (this.esempresa) {
      this._empresasService.perfilempresa().subscribe( data=> {
        this.empresa = data;
      })
    }
    this.frubros();
    this.fmunicipios();
    this.fasociaciones();
  }

  getFormacionDescription(value: number): string {
    return this.formacionMap[value] || 'Desconocido';
  }
  getEstadoDescription(value: number): string {
    return this.estadocivilMap[value] || 'Desconocido';
  }
  getHijosDescription(value: number): string {
    return this.hijosMap[value] || 'Desconocido';
  }
  getCapacidadDescription(value: number): string{
    return this.capacidadMap[value] || 'Desconocido';
  }
  getMotivoDescription(value: number): string{
    return this.motivoMap[value] || 'Desconocido';
  }
  getInvolucradosDescription(value: number): string{
    return this.involucradosMap[value] || 'Desconocido';
  }
  getTrabajadoresDescription(value: number): string{
    return this.trabajadoresMap[value] || 'Desconocido';
  }
  getFeriasDescription(value: number): string{
    return this.feriasMap[value] || 'Desconocido';
  }

  fdato() {
    this._personasService.perfil().subscribe(data=>{
      this.perfil = data;
    });
  }

  fcambiarimagen(contenido: any) {
    this.estado = 'Actualizar';
    this._modalService.open(contenido, {
      backdrop: 'static',
      keyboard: false
    });
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
    this._modalService.open(contenido, {
      backdrop: 'static',
      keyboard: false
    });
  }

  crearformulario() {
    this.formulario = this._fb.group ({
      cclave: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-zA-Z0-9]*'),
          Validators.minLength(8),
          Validators.maxLength(50)
        ]
      ],
      clave: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-zA-Z0-9]*'),
          Validators.minLength(8),
          Validators.maxLength(50)
        ]
      ]
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

  fdocumento() {
    this._documentoService.listar().subscribe( data => {
      this.documento = data;
    });
  }

  fextension() {
    this._extensionesService.listar().subscribe( data => {
      this.extension = data;
    });
  }

  fgenero() {
    this._generosService.listar().subscribe( data => {
      this.genero = data;
    });
  }

  fformUser(dato: Personas, disabled: boolean = false) {
    this.formUser = this._fbU.group({
      primerapellido: [
        dato.primerapellido,
        [
          Validators.required,
          Validators.pattern('^[a-zA-ZÀ-ÿ\u00f1\u00d1\\s]+$'),
          Validators.maxLength(50)
        ],
      ],
      segundoapellido: [
        dato.segundoapellido,
        [
          Validators.pattern('^[a-zA-ZÀ-ÿ\u00f1\u00d1\\s]+$'),
          Validators.maxLength(50)
        ]
      ],
      primernombre: [
        dato.primernombre,
        [
          Validators.required,
          Validators.pattern('^[a-zA-ZÀ-ÿ\u00f1\u00d1\\s]+$'),
          Validators.maxLength(50)
        ]
      ],
      idtipogenero: [
        dato?.tipogenero?.idtipogenero,
        [
          Validators.required
        ]
      ],
      idtipodocumento: [
        dato?.tipodocumento?.idtipodocumento,
        [
          Validators.required
        ]
      ],
      dip: [
        dato.dip,
        [
          Validators.required,
          Validators.pattern('^[0-9]+$'),
          Validators.maxLength(15)
        ]
      ],
      complementario:[
        dato.complementario,
        [
          Validators.pattern('^[a-zA-Z0-9\u00f1\u00d1]+$'),
          Validators.maxLength(5)
        ]
      ],
      idtipoextension:[
        dato?.tipoextension?.idtipoextension,
        [
          Validators.required
        ]
      ],
      celular: [
        dato.celular,
        [
          Validators.pattern('^[0-9]+$'),
          Validators.maxLength(15)
        ],
      ],
      telefono: [
        dato.telefono,
        [
          Validators.pattern('^[0-9]+$'),
          Validators.maxLength(15)
        ],
      ],
      direccion: [
        dato.direccion,
        [
          Validators.pattern('^[a-zA-Z0-9\u00f1\u00d1\s.,#-]+$'),
          Validators.minLength(8),
          Validators.maxLength(255)
        ]
      ],
      correo:[
        dato.correo,
        [
          Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'),
          Validators.minLength(8),
          Validators.maxLength(255)
        ]
      ],
      formacion: [
        dato.formacion,
        [
          Validators.required,
        ]
      ],
      estadocivil: [
        dato.estadocivil,
        [
          Validators.required,
        ]
      ],
      hijos: [
        dato.hijos,
        [
          Validators.required,
        ]
      ],

    });
  }

  get fU() { return this.formUser.controls; }

  onInput(event: any, controlName: string, type: 'letras' | 'letrasyespacios' | 'numeros' | 'letrasynumerosguion' | 'direccion' | 'correo'): void {
    let input = event.target.value;
    switch (type) {
      case 'letras':
        input = input.replace(/[^a-zA-ZÀ-ÿ\u00f1\u00d1]/g, '');
        break;
      case 'letrasyespacios':
        input = input.replace(/[^a-zA-ZÀ-ÿ\u00f1\u00d1\s]/g, '');
        break;
      case 'numeros':
        input = input.replace(/[^0-9]/g, '');
        break;
      case 'letrasynumerosguion':
        input = input.replace(/[^a-zA-Z0-9\u00f1\u00d1]/g, '');
        break;
      case 'direccion':
        input = input.replace(/[^a-zA-Z0-9\u00f1\u00d1\s.,#-]/g, '');
        break;
      case 'correo':
        input = input.replace(/[^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$]/g, '');
        break;
    }
    // this.formulario.get(controlName)?.setValue(input.toUpperCase(), { emitEvent: false });
    if (this.formUser.get(controlName)) {
      this.formUser.get(controlName)?.setValue(input.toUpperCase(), { emitEvent: false });
    }
    if (this.formEmpresa.get(controlName)) {
      this.formEmpresa.get(controlName)?.setValue(input.toUpperCase(), { emitEvent: false });
    }
  }

  fmodificar(content: any) {
    this.estado = 'Modificar';
    this._personasService.perfil().subscribe(data=>{
      this.perfil = data;
      this.fformUser(this.perfil);
      this._modalService.open(content, {
        backdrop: 'static',
        keyboard: false,
        size: 'lg'
      });
    });
  }

  faceptar(): void {
    function toUpperCaseDefined(value: string | undefined): string {
      return value ? value.toUpperCase() : '';
    }
    this.submitted = true;

    this.perfil.primerapellido = toUpperCaseDefined(this.formUser.value.primerapellido);
    this.perfil.segundoapellido = toUpperCaseDefined(this.formUser.value.segundoapellido);
    this.perfil.primernombre = toUpperCaseDefined(this.formUser.value.primernombre);
    this.perfil.idtipogenero = this.formUser.value.idtipogenero;
    this.perfil.idtipodocumento = this.formUser.value.idtipodocumento;
    this.perfil.dip = this.formUser.value.dip;
    this.perfil.complementario = toUpperCaseDefined(this.formUser.value.complementario);
    this.perfil.idtipoextension = this.formUser.value.idtipoextension;
    this.perfil.telefono = this.formUser.value.celular;
    this.perfil.celular = this.formUser.value.celular;
    this.perfil.formacion = this.formUser.value.formacion;
    this.perfil.estadocivil = this.formUser.value.estadocivil;
    this.perfil.hijos = this.formUser.value.hijos;

    if (this.estado === 'Modificar') {
      this._personasService.modificar(this.perfil).subscribe((data) => {
        this.fdato();
        this._modalService.dismissAll();
        swal.fire('Exito', 'Representante modificado con exito', 'success');
      });
    }
  }

  getFormControls(): string[] {
    return Object.keys(this.formUser.controls);
  }

  nextStep() {
    if (this.step < 5) {
      this.step++;
    }
  }

  prevStep() {
    if (this.step > 1) {
      this.step--;
    }
  }

  goToStep(step: number) {
    this.step = step;
  }

  getFormEmpControls(): string[] {
    return Object.keys(this.formEmpresa.controls);
  }

  fmunicipios(){
    this._municipiosService.datosl().subscribe((data) => {
      this.municipios = data;
    })
  }

  flocalidades(id: number) {
    this._localidadesService.localidades(id).subscribe( data => {
      this.localidades = data;
    });
  }

  frubros(){
    this._rubrosService.datosl().subscribe((data) => {
      this.rubros = data;
    })
  }

  fsubrubros(id: number) {
    this._subrubrosService.subrubros(id).subscribe( data => {
      this.subrubros = data;
    });
  }

  fasociaciones() {
    this._asociacionesService.datosl().subscribe( data => {
      this.asociaciones = data;
    });
  }

  fformEmpresa(dato: Empresas) {
    this.formEmpresa = this._fbE.group({

      nform:[
        dato.nform,
        [
          Validators.required,
          Validators.pattern('^[0-9]+$'),
          Validators.minLength(1),
          Validators.maxLength(4)
        ]
      ],
      fechareg: [
        dato.fechareg,
        [
          Validators.required,
        ]
      ],
      empresa: [
        dato.empresa,
        [
          Validators.required,
          Validators.pattern('^[a-zA-ZÀ-ÿ\u00f1\u00d1\\s]+$'),
          Validators.minLength(5),
          Validators.maxLength(150)
        ]
      ],
      razonsocial:[
        dato.razonsocial,
        [
          Validators.required,
          Validators.pattern('^[a-zA-ZÀ-ÿ\u00f1\u00d1\\s]+$'),
          Validators.minLength(5),
          Validators.maxLength(150)
        ]
      ],
      nit: [
        dato.nit,
        [
          Validators.pattern('^[0-9]+$'),
          Validators.minLength(5),
          Validators.maxLength(20)
        ]
      ],
      bancamovil:[
        dato.bancamovil
      ],
      descripcion: [
        dato.descripcion,
        [
          Validators.required,
          Validators.pattern('^[a-zA-ZÀ-ÿ\u00f1\u00d1\\s]+$'),
          Validators.minLength(8),
          Validators.maxLength(255)
        ]
      ],
      idasociacion: [
        dato.idasociacion
      ],
      celular: [
        dato.celular,
        [
          Validators.required,
          Validators.pattern('^[0-9]+$')
        ]
      ],
      telefono: [
        dato.telefono,
        [
          Validators.required,
          Validators.pattern('^[0-9]+$')
        ]
      ],
      idrubro: [
        dato.subrubro?.idrubro
      ],
      idsubrubro: [
        dato.idsubrubro,
        [
          Validators.required
        ]
      ],
      servicios:[
        dato.servicios,
      ],
      capacidad:[
        dato.capacidad
      ],
      unidadmedida:[
        dato.unidadmedida
      ],
      fechaapertura:[
        dato.fechaapertura
      ],
      motivo:[
        dato.motivo
      ],
      otromotivo:[
        dato.otromotivo
      ],
      familiar:[
        dato.familiar
      ],
      involucrados:[
        dato.involucrados
      ],
      otrosinvolucrados:[
        dato.otrosinvolucrados
      ],
      trabajadores:[
        dato.trabajadores
      ],
      participacion:[
        dato.participacion
      ],
      capacitacion:[
        dato.capacitacion
      ],
      idmunicipio:[
        dato.localidad?.idmunicipio
      ],
      idlocalidad:[
        dato.idlocalidad,
        [
          Validators.required
        ]
      ],
      zona: [
        dato.zona
      ],
      direccion:[
        dato.direccion,
        [
          Validators.required
        ]
      ],
      referencia:[
        dato.referencia
      ],
      transporte:[
        dato.transporte
      ],
      correo: [
        dato.correo,
        [
          Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')
        ]
      ],
      facebook: [
        dato.facebook
      ],
      twitter: [
        dato.twitter
      ],
      instagram: [
        dato.instagram
      ],
      paginaweb: [
        dato.paginaweb
      ],
      latitud: [
        dato.latitud
      ],
      longitud:[
        dato.longitud
      ]
    });
    this.formEmpresa.get('motivo').valueChanges.subscribe(value => {
      this.mostrarOtroCampo = value === '5';
      if (!this.mostrarOtroCampo) {
        this.formEmpresa.get('otromotivo').setValue('');
      }
    });

    this.formEmpresa.get('familiar').valueChanges.subscribe(value => {
      this.mostrarInvolucrados = value;
      if (!value) {
        this.formEmpresa.get('involucrados').setValue('');
        this.mostrarOtro = false;
      }
    });

    this.formEmpresa.get('involucrados').valueChanges.subscribe(value => {
      this.mostrarOtro = value === '6';
      if (!this.mostrarOtro) {
        this.formEmpresa.get('otrosinvolucrados').setValue('');
      }
    });
  }

  onMotivoChange(event: any) {
    const value = event.target.value;
    this.mostrarOtroCampo = value === '5';
  }
  onInvolucradosChange(event: any) {
    const value = event.target.value;
    this.mostrarOtro = value === '6';
  }

  get fE() { return this.formEmpresa.controls; }

  fmodificarEmpresa(content: any) {
    this.estado = 'Modificar';
    this.goToStep(1);
    this._empresasService.perfilempresa().subscribe((data) => {
      this.empresa = data;
      this.fformEmpresa(this.empresa);
      this._modalService.open(content, {
        backdrop: 'static',
        keyboard: false,
        size: 'lg'
      });
    });
  }

  faceptarEmp(){

  }

}
