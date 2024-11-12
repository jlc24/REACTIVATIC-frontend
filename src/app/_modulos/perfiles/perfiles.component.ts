import { Empresas } from 'src/app/_entidades/empresas';
import { AccesoService } from 'src/app/_aods/acceso.service';
import { EmpresasService } from 'src/app/_aods/empresas.service';
import { Usuarios } from './../../_entidades/usuarios';
import { UsuariosService } from './../../_aods/usuarios.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Personas } from './../../_entidades/personas';
import { PersonasService } from './../../_aods/personas.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import swal from 'sweetalert2';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
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
import { ToastrService } from 'ngx-toastr';
import { HttpEventType } from '@angular/common/http';
import { UtilsService } from 'src/app/_aods/utils.service';

@Component({
  selector: 'app-perfiles',
  templateUrl: './perfiles.component.html',
  styleUrls: ['./perfiles.component.css']
})
export class PerfilesComponent implements OnInit {

  gestion: number = new Date().getFullYear();

  perfil: Personas;
  estado: string;
  //archivoseleccionado: File;
  imagenUsuario: any[];
  imagenRepAnverso: any[];
  imagenRepReverso: any[];
  imagenEmpresa: any[];
  imagenCarousel: any[];

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
    1: '1 HIJO',
    2: '2 HIJOS',
    3: '3 HIJOS',
    4: '4 HIJOS',
    5: '5 A MAS HIJOS',
    6: 'SIN HIJOS',
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
    4: 'INTERNACIONAL',
    5: 'NINGUNA'
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
  stepRep: number = 1;

  municipios: Municipios[];
  localidades: Localidades[];
  rubros: Rubros[];
  subrubros: Subrubros[];
  asociaciones: Asociaciones[];

  mostrarOtroCampo = false;
  mostrarInvolucrados = false;
  mostrarOtro = false;

  @ViewChild('archivoInput') archivoInput: ElementRef;
  archivoSeleccionado: File = null;
  miniaturaUrl: string | ArrayBuffer = null;
  sizeFileFormat: string | null = null;
  cargando: boolean = false;
  progreso: number = 0;

  attempts: number = 0;
  maxAttempts: number = 3;
  lockEndTime: number = 0;
  intervalId: any;

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
    private toast: ToastrService,
    private _fb: FormBuilder,
    private _fbU: FormBuilder,
    private _fbE: FormBuilder,
    private sanitizer: DomSanitizer,
    private utilsService: UtilsService,
  ) { }

  ngOnInit(): void {
    this.escliente = this._accesoService.esRolClientes();
    this.esempresa = this._accesoService.esRolEmpresa();
    this.esreactivatic = this._accesoService.esRolReactivatic();
    this.esdpeic = this._accesoService.esRolDpeic();
    this.essddpi = this._accesoService.esRolSddpi();
    this.esadmin = this._accesoService.esRolAdmin();
    this.fdato();
    this.fdocumento();
    this.fextension();
    this.fgenero();
    this.esempresa = this._accesoService.esRolEmpresa();
    this.frubros();
    this.fmunicipios();
    this.fasociaciones();
    if (this.esempresa) {
      this._empresasService.perfilempresa().subscribe( data=> {
        this.empresa = data;
        this.fdescargar('repanverso');
        this.fdescargar('repreverso');
        this.fdescargar('empresas');
        this.fdescargar('carousel');
      });
    }else{
      this.fdescargar('usuarios');
    }

    this.formulario = this._fb.group({
      aclave: ['', [Validators.required]],
      nclave: ['', [Validators.required]],
      cclave: ['', [Validators.required]]
    });
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

  fcancelar() {
    this._modalService.dismissAll();
    this.archivoSeleccionado = null;
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
      aclave: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-zA-Z0-9]*'),
          Validators.minLength(8),
          Validators.maxLength(50)
        ]
      ],
      nclave: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-zA-Z0-9]*'),
          Validators.minLength(8),
          Validators.maxLength(50)
        ]
      ],
      cclave: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-zA-Z0-9]*'),
          Validators.minLength(8),
          Validators.maxLength(50),
        ]
      ]
    },
    {
      validator: MustMatch('nclave', 'cclave')
    });
  }

  get f() {
    return this.formulario.controls;
  }

  faceptarcambiarclave() {
    this.submitted = true;

    let aclave = this.formulario.value.aclave;
    let nclave = this.formulario.value.nclave;

    this._usuariosService.verificar({ clave: aclave }).subscribe(
      (response) => {
        this.toast.success('Clave correcta.','Éxito');
        this._usuariosService.cambiarclave({ idusuario: null, clave: nclave }).subscribe(response => {
          swal.fire('Cambio de Clave', 'La clave ha sido cambiada con éxito.', 'success');
          this._modalService.dismissAll();
          this.formulario.reset();
          this.submitted = false;
        });
      },
      (error) => {
        this.toast.error('Clave incorrecta, vuelva a intentarlo','Error');
        this.formulario.get('aclave')?.reset();
        this.formulario.get('nclave')?.reset();
        this.formulario.get('cclave')?.reset();
      }
    );
  }

  onInputClave(event: any, controlName: string, type: 'letrasynumeros' ): void{
    let input = event.target.value;
    switch (type) {
      case 'letrasynumeros':
        input = input.replace(/[^a-zA-Z0-9]/g, '');
        break;
    }
    if (this.formulario.get(controlName)) {
      this.formulario.get(controlName)?.setValue(input, { emitEvent: false });
    }
  }

  blockUI() {
    const remainingTime = 30; // Tiempo de bloqueo en segundos
    this.lockEndTime = Date.now() + remainingTime * 1000; // Calcular el tiempo de desbloqueo

    swal.fire({
      title: 'Intentos excedidos',
      html: `<div>Espere <strong id="countdown">${remainingTime}</strong> segundos para intentar de nuevo.</div>`,
      allowOutsideClick: false,
      allowEscapeKey: false,
      onBeforeOpen: () => {
        swal.showLoading(); // Mostrar el ícono de carga
        this.updateCountdown(); // Actualizar el contador
      }
    });
  }

  updateCountdown() {
    const interval = 1000; // Intervalo en milisegundos
    this.intervalId = setInterval(() => {
      const now = Date.now();
      const remainingTime = Math.max(0, Math.ceil((this.lockEndTime - now) / 1000));
      if (remainingTime <= 0) {
        clearInterval(this.intervalId);
        swal.close(); // Cerrar el Swal cuando se acabe el tiempo
        this.attempts = 0; // Reiniciar el contador de intentos
      } else {
        document.getElementById('countdown').innerText = remainingTime.toString();
      }
    }, interval);
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
          Validators.pattern('^[a-zA-Z0-9\u00f1\u00d1\\s.,#-]+$'),
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
      ],
      estadocivil: [
        dato.estadocivil,
      ],
      hijos: [
        dato.hijos,
      ],

    });
  }

  get fU() { return this.formUser.controls; }

  onInputUser(event: any, controlName: string, type: 'letras' | 'letrasyespacios' | 'numeros' | 'letrasynumerosguion' | 'letrasynumeros' | 'direccion' | 'correo' | 'formulario'): void{
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
      case 'letrasynumeros':
        input = input.replace(/[^a-zA-Z0-9]/g, '');
        break;
      case 'direccion':
        input = input.replace(/[^a-zA-Z0-9\u00f1\u00d1\s.,#-]/g, '');
        break;
      case 'correo':
        input = input.replace(/[^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$]/g, '');
        break;
      case 'formulario':
        input = input.replace(/[^a-zA-Z0-9-]/g, '');
        break;
    }
    if (this.formUser.get(controlName)) {
      this.formUser.get(controlName)?.setValue(input.toUpperCase(), { emitEvent: false });
    }
  }



  fmodificar(content: any) {
    this.utilsService.mostrarCargando();
    this.estado = 'Modificar';
    this.goToStepRep(1);
    this._personasService.perfil().subscribe(data=>{
      this.perfil = data;
      this.fformUser(this.perfil);
      this._modalService.open(content, {
        backdrop: 'static',
        keyboard: false,
        size: 'lg',
        scrollable: true
      });
      this.utilsService.cerrarCargando();
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
    this.perfil.telefono = this.formUser.value.telefono;
    this.perfil.celular = this.formUser.value.celular;
    this.perfil.direccion = this.formUser.value.direccion;
    this.perfil.correo = this.formUser.value.correo;
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

  nextStepRep() {
    if (this.stepRep < 3) {
      this.stepRep++;
    }
  }

  prevStepRep() {
    if (this.stepRep > 1) {
      this.stepRep--;
    }
  }

  goToStepRep(stepRep: number) {
    this.stepRep = stepRep;
  }

  getFormEmpControls(): string[] {
    return Object.keys(this.formEmpresa.controls);
  }
  getFormControlsRep(): string[] {
    return Object.keys(this.formUser.controls);
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
          Validators.minLength(1),
          Validators.maxLength(20)
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
          Validators.pattern('^[a-zA-ZÀ-ÿ0-9\u00f1\u00d1\\s.,&-\']+$'),
          Validators.minLength(5),
          Validators.maxLength(150)
        ]
      ],
      razonsocial:[
        dato.razonsocial,
        [
          Validators.required,
          Validators.pattern('^[a-zA-ZÀ-ÿ0-9\u00f1\u00d1\\s.,&-\']+$'),
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
      ],
      idasociacion: [
        dato.asociacion?.idasociacion
      ],
      celular: [
        dato.celular,
        [
          //Validators.required,
          Validators.pattern('^[0-9]+$'),
          Validators.maxLength(20)
        ]
      ],
      telefono: [
        dato.telefono,
        [
          //Validators.required,
          Validators.pattern('^[0-9]+$'),
          Validators.maxLength(20)
        ]
      ],
      idrubro: [
        dato.rubro?.idrubro,
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
        dato.municipio?.idmunicipio,
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
        this.mostrarOtroCampo = false;
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
        this.mostrarOtro = false;
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

  onInput(event: any, controlName: string, type: 'letras' | 'letrasyespacios' | 'numeros' | 'letrasynumerosguion' | 'letrasynumeros' | 'direccion' | 'correo' | 'formulario'): void {
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
        input = input.replace(/[^a-zA-Z0-9\u00f1\u00d1\s-\']/g, '');
        break;
      case 'letrasynumeros':
        input = input.replace(/[^a-zA-Z0-9]/g, '');
        break;
      case 'direccion':
        input = input.replace(/[^a-zA-Z0-9\u00f1\u00d1\s.,#-]/g, '');
        break;
      case 'correo':
        input = input.replace(/[^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$]/g, '');
        break;
      case 'formulario':
        input = input.replace(/[^a-zA-Z0-9-]/g, '');
        break;
    }
    if (this.formEmpresa.get(controlName)) {
      this.formEmpresa.get(controlName)?.setValue(input.toUpperCase(), { emitEvent: false });
    }
  }

  fmodificarEmpresa(content: any) {
    this.utilsService.mostrarCargando();
    this.estado = 'Modificar';
    this.goToStep(1);
    this._empresasService.perfilempresa().subscribe((data) => {
      this.empresa = data;
      this.fformEmpresa(this.empresa);
      if (data.otromotivo) {
        this.mostrarOtroCampo = true;
      }
      if (data.familiar) {
        this.mostrarInvolucrados = true;
      }
      if (data.otrosinvolucrados) {
        this.mostrarOtro = true;
      }
      this._modalService.open(content, {
        backdrop: 'static',
        keyboard: false,
        size: 'lg',
        scrollable: true,
      });
      this.utilsService.cerrarCargando();
    });
  }

  faceptarEmp(){
    this.submitted = true;

    this.empresa.idrubro = this.formEmpresa.value.idrubro;
    this.empresa.idmunicipio = this.formEmpresa.value.idmunicipio;
    this.empresa.idasociacion = this.formEmpresa.value.idasociacion;
    this.empresa.empresa = this.formEmpresa.value.empresa;
    this.empresa.descripcion = this.formEmpresa.value.descripcion;
    this.empresa.tipo = 'EMPRESA';
    this.empresa.direccion = this.formEmpresa.value.direccion;
    this.empresa.telefono = this.formEmpresa.value.telefono;
    this.empresa.celular = this.formEmpresa.value.celular;
    this.empresa.correo = this.formEmpresa.value.correo;
    this.empresa.facebook = this.formEmpresa.value.facebook;
    this.empresa.twitter = this.formEmpresa.value.twitter;
    this.empresa.instagram = this.formEmpresa.value.instagram;
    this.empresa.paginaweb = this.formEmpresa.value.paginaweb;
    this.empresa.nform = this.formEmpresa.value.nform;
    this.empresa.latitud = this.formEmpresa.value.latitud;
    this.empresa.longitud = this.formEmpresa.value.longitud;
    this.empresa.nit = this.formEmpresa.value.nit;
    this.empresa.bancamovil = this.formEmpresa.value.bancamovil;
    this.empresa.fechaapertura = this.formEmpresa.value.fechaapertura;
    this.empresa.servicios = this.formEmpresa.value.servicios;
    this.empresa.capacidad = this.formEmpresa.value.capacidad;
    this.empresa.unidadmedida = this.formEmpresa.value.unidadmedida;
    this.empresa.motivo = this.formEmpresa.value.motivo;
    this.empresa.otromotivo = this.formEmpresa.value.otromotivo;
    this.empresa.familiar = this.formEmpresa.value.familiar;
    this.empresa.involucrados = this.formEmpresa.value.involucrados;
    this.empresa.otrosinvolucrados = this.formEmpresa.value.otrosinvolucrados;
    this.empresa.trabajadores = this.formEmpresa.value.trabajadores;
    this.empresa.participacion = this.formEmpresa.value.participacion;
    this.empresa.capacitacion = this.formEmpresa.value.capacitacion;
    this.empresa.zona = this.formEmpresa.value.zona;
    this.empresa.referencia = this.formEmpresa.value.referencia;
    this.empresa.transporte = this.formEmpresa.value.transporte;
    this.empresa.fechareg = this.formEmpresa.value.fechareg;
    this.empresa.razonsocial = this.formEmpresa.value.razonsocial;
    this.empresa.registrosenasag = this.formEmpresa.value.registrosenasag;


    if (this.estado === 'Modificar') {
      this.empresa.idempresa = this.empresa.idempresa;

      this._empresasService.modificar(this.empresa).subscribe((data) => {
        this.fdato();
        this._modalService.dismissAll();
        swal.fire('Dato modificado', 'Dato modificado con exito', 'success');
      });
    }

  }

  fimagenUsuario(contenido: any) {
    this.estado = 'Perfil';
    this._modalService.open(contenido, {
      backdrop: 'static',
      keyboard: false
    });
  }
  fimagenRepA(contenido: any) {
    this.estado = 'Carnet Anverso';
    this._modalService.open(contenido, {
      backdrop: 'static',
      keyboard: false
    });
  }
  fimagenRepR(contenido: any) {
    this.estado = 'Carnet Reverso';
    this._modalService.open(contenido, {
      backdrop: 'static',
      keyboard: false
    });
  }
  fimagenEmp(contenido: any) {
    this.estado = 'Empresa';
    this._modalService.open(contenido, {
      backdrop: 'static',
      keyboard: false
    });
  }
  fimagenCarousel(contenido: any) {
    this.estado = 'Carousel';
    this._modalService.open(contenido, {
      backdrop: 'static',
      keyboard: false
    });
  }

  fcargar() {
    swal.fire({
      title: 'Cargando archivo...',
      html: 'Progreso: <b>0%</b>',
      allowOutsideClick: false,
      onBeforeOpen: () => {
        swal.showLoading();
      }
    });
    if (this.estado === 'Perfil') {
      this._personasService.uploadperfil(this.archivoSeleccionado, 'usuarios').subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          const progreso = Math.round((event.loaded / event.total) * 100);
          swal.getHtmlContainer().querySelector('b').textContent = `${progreso}%`;
        } else if (event.type === HttpEventType.Response) {
          swal.close();
          swal.fire('Archivo cargado', 'Archivo cargado con éxito', 'success');
          this.toast.success('','Image de perfil cambiado.');
          this.fdescargar('usuarios');
          this._modalService.dismissAll();
          this.archivoSeleccionado = null;
        }
      }, error => {
        swal.close();
        swal.fire('Error', 'Ocurrió un error durante la subida, por favor contacte al ADMINISTRADOR', 'error');
      });
    }else if (this.estado === 'Carnet Anverso') {
      this._personasService.upload(this.perfil.idpersona.toString(), 'repanverso', this.archivoSeleccionado).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          const progreso = Math.round((event.loaded / event.total) * 100);
          swal.getHtmlContainer().querySelector('b').textContent = `${progreso}%`;
        } else if (event.type === HttpEventType.Response) {
          swal.close();
          swal.fire('Archivo cargado', 'Archivo cargado con éxito', 'success');
          this.toast.success('', 'Carnet Anverso cambiado.');
          this.fdescargar('repanverso');
          this._modalService.dismissAll();
          this.archivoSeleccionado = null;
        }
      }, error => {
        swal.close();
        swal.fire('Error', 'Ocurrió un error durante la subida, por favor contacte al ADMINISTRADOR', 'error');
      });
    }else if (this.estado === 'Carnet Reverso') {
      this._personasService.upload(this.perfil.idpersona.toString(), 'repreverso', this.archivoSeleccionado).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          const progreso = Math.round((event.loaded / event.total) * 100);
          swal.getHtmlContainer().querySelector('b').textContent = `${progreso}%`;
        } else if (event.type === HttpEventType.Response) {
          swal.close();
          swal.fire('Archivo cargado', 'Archivo cargado con éxito', 'success');
          this.toast.success('', 'Carnet Reverso cambiado.');
          this.fdescargar('repreverso');
          this._modalService.dismissAll();
          this.archivoSeleccionado = null;
        }
      }, error => {
        swal.close();
        swal.fire('Error', 'Ocurrió un error durante la subida, por favor contacte al ADMINISTRADOR', 'error');
      });
    }else if (this.estado === 'Empresa') {
      this._empresasService.upload(this.empresa.idempresa.toString(), 'empresas', this.archivoSeleccionado).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          const progreso = Math.round((event.loaded / event.total) * 100);
          swal.getHtmlContainer().querySelector('b').textContent = `${progreso}%`;
        } else if (event.type === HttpEventType.Response) {
          swal.close();
          this.toast.success('', 'Logo de empresa agregado.');
          this.fdescargar('empresas');
          this._modalService.dismissAll();
          this.archivoSeleccionado = null;
        }
      }, error => {
        swal.close();
        swal.fire('Error', 'Ocurrió un error durante la subida, por favor contacte al ADMINISTRADOR', 'error');
      });
    }else if (this.estado === 'Carousel') {
      this._empresasService.upload(this.empresa.idempresa.toString(), 'carousel', this.archivoSeleccionado).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          const progreso = Math.round((event.loaded / event.total) * 100);
          swal.getHtmlContainer().querySelector('b').textContent = `${progreso}%`;
        } else if (event.type === HttpEventType.Response) {
          swal.close();
          this.toast.success('', 'Imagen para carousel cargado.');
          this.fdescargar('carousel');
          this._modalService.dismissAll();
          this.archivoSeleccionado = null;
        }
      }, error => {
        swal.close();
        swal.fire('Error', 'Ocurrió un error durante la subida, por favor contacte al ADMINISTRADOR', 'error');
      });
    }
  }

  fdescargar(rol: string) {
    if (rol == 'empresas') {
      this.imagenEmpresa = [];
      this._empresasService.download(this.empresa?.idempresa, rol).subscribe((data) => {
        this.imagenEmpresa = data;
      });
    }
    if (rol == 'carousel') {
      this.imagenCarousel = [];
      this._empresasService.download(this.empresa?.idempresa, rol).subscribe((data) => {
        this.imagenCarousel = data;
      });
    }
    if(rol == 'usuarios'){
      this.imagenUsuario = [];
      this._personasService.downloadperfil(rol).subscribe((data) => {
        this.imagenUsuario = data;
      });
    }
    if (rol == 'repanverso') {
      this.imagenRepAnverso = [];
      this._personasService.downloadperfil(rol).subscribe((data) => {
        this.imagenRepAnverso = data;
      });
    }
    if (rol == 'repreverso') {
      this.imagenRepReverso = [];
      this._personasService.downloadperfil(rol).subscribe((data) => {
        this.imagenRepReverso = data;
      });
    }
  }

  sanitizarImagen(data: string, mimeType: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(`data:${mimeType};base64,${data}`);
  }
  // this._personasService.descargarImagen().subscribe(data=>{
  //   const objectURL = window.URL.createObjectURL(data);
  //   this.imagen = this._sanitizer.bypassSecurityTrustUrl(objectURL);
  // })

  fseleccionarArchivo(event: any) {
    const archivo = event.target.files[0];
    if (!archivo) {
      return;
    }

    const tamañoMaximoMB = 2;
    const tamañoMaximoBytes = tamañoMaximoMB * 1024 * 1024;
    if (archivo.size > tamañoMaximoBytes) {
      this.toast.error(`El archivo supera el límite de ${tamañoMaximoMB} MB.`, 'Tamaño de archivo no permitido');
      this.fremoverArchivo();
      return;
    }

    const tipoArchivo = archivo.type;
    if (tipoArchivo !== 'image/png' && tipoArchivo !== 'image/jpeg') {
      this.toast.error('Solo se permiten archivos PNG o JPG.', 'Formato no soportado');
      this.fremoverArchivo();
      return;
    }

    this.archivoSeleccionado = archivo;
    this.sizeFileFormat = this.fformatearTamañoArchivo(archivo.size);
    this.fcrearMiniatura();
  }

  fformatearTamañoArchivo(tamañoBytes: number): string {
    const tamañoMB = tamañoBytes / (1024 * 1024);
    return `${tamañoMB.toFixed(2)} MB`;
  }

  farrastrarSobre(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    (event.currentTarget as HTMLElement).classList.add('dragover');
  }

  farrastrarFuera(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    (event.currentTarget as HTMLElement).classList.remove('dragover');
  }

  fsoltarArchivo(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    (event.currentTarget as HTMLElement).classList.remove('dragover');

    if (event.dataTransfer.files.length > 0) {
      this.archivoSeleccionado = event.dataTransfer.files[0];
      this.fcrearMiniatura();
    }
  }

  fcrearMiniatura() {
    if (this.archivoSeleccionado) {
      const reader = new FileReader();
      reader.onload = (e) => this.miniaturaUrl = reader.result;
      reader.readAsDataURL(this.archivoSeleccionado);
    }
  }

  fremoverArchivo() {
    this.archivoSeleccionado = null;
    this.miniaturaUrl = null;
  }

}
