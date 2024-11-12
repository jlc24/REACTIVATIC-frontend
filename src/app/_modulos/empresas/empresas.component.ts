import { RepresentantesService } from './../../_aods/representantes.service';
import { AsociacionesService } from 'src/app/_aods/asociaciones.service';
import { Representantes } from './../../_entidades/representantes';
import { Asociaciones } from './../../_entidades/asociaciones';
import { LocalidadesService } from 'src/app/_aods/localidades.service';
import { Component, ElementRef, OnInit, Sanitizer, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EmpresasService } from 'src/app/_aods/empresas.service';
import { Empresas } from 'src/app/_entidades/empresas';
import swal from 'sweetalert2';
import { SubrubrosService } from 'src/app/_aods/subrubros.service';
import { Localidades } from 'src/app/_entidades/localidades';
import { Subrubros } from 'src/app/_entidades/subrubros';
import { ToastrService } from 'ngx-toastr';
import { AccesoService } from 'src/app/_aods/acceso.service';
import { RUTA } from 'src/app/_config/application';
import { Usuarios } from 'src/app/_entidades/usuarios';
import { Personas } from 'src/app/_entidades/personas';
import { Tiposdocumentos } from 'src/app/_entidades/tiposdocumentos';
import { Tiposextensiones } from 'src/app/_entidades/tiposextensiones';
import { Tiposgeneros } from 'src/app/_entidades/tiposgeneros';
import { Roles } from 'src/app/_entidades/roles';
import { UsuariosService } from 'src/app/_aods/usuarios.service';
import { PersonasService } from 'src/app/_aods/personas.service';
import { TiposdocumentosService } from 'src/app/_aods/tiposdocumentos.service';
import { TiposextensionesService } from 'src/app/_aods/tiposextensiones.service';
import { TiposgenerosService } from 'src/app/_aods/tiposgeneros.service';
import { RolesService } from 'src/app/_aods/roles.service';
import { Municipios } from 'src/app/_entidades/municipios';
import { Rubros } from 'src/app/_entidades/rubros';
import { RubrosService } from 'src/app/_aods/rubros.service';
import { MunicipiosService } from 'src/app/_aods/municipios.service';
import { HttpEventType } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { UtilsService } from 'src/app/_aods/utils.service';
import { switchMap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { Route, Router } from '@angular/router';
import { Beneficiosempresas } from 'src/app/_entidades/beneficiosempresas';
import { BeneficiosempresasService } from 'src/app/_aods/beneficiosempresas.service';

@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.css']
})
export class EmpresasComponent implements OnInit {

  ruta = `${RUTA}/catalogos/descargarempresa/`;

  @ViewChild('archivoInput') archivoInput: ElementRef;
  archivoSeleccionado: File = null;
  miniaturaUrl: string | ArrayBuffer = null;
  sizeFileFormat: string | null = null;
  cargando: boolean = false;
  progreso: number = 0;

  usuarios: Usuarios[];
  persona: Personas;
  user: Usuarios;
  documento: Tiposdocumentos[];
  extension: Tiposextensiones[];
  genero: Tiposgeneros[];
  rol: Roles[];

  datos: Empresas[];
  dato: Empresas;
  municipios: Municipios[];
  localidades: Localidades[];
  rubros: Rubros[];
  subrubros: Subrubros[];
  asociaciones: Asociaciones[];
  representantes: Representantes[];
  representante: Representantes;
  imagenRepAnverso: any[];
  imagenRepReverso: any[];
  beneficiosempresas: Beneficiosempresas[] = [];
  buscarbeneficio: string = '';
  totalbe: number = 0;

  pagina: number = 0;
  numPaginas: number = 0;
  cantidad: number = 10;
  buscar: string = '';
  rubro: string = '';
  buscarRep: string = '';
  total: number = 0;
  estado: string = '';

  formEmpresa: FormGroup;
  formRep: FormGroup;
  submitted: boolean = false;

  imagen: any;

  imageSrc: string;

  modalRefEmpresa: NgbModalRef;
  modalRefPersona: NgbModalRef;
  modalRefCarnet: NgbModalRef;

  step: number = 1;
  stepRep: number = 1;

  formacionMap: { [key: number]: string } = {
    1: 'INICIAL',
    2: 'PRIMARIA',
    3: 'SECUNDARIA',
    4: 'TECNICO',
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
    5: 'NINGUNO',
  }

  //copiarDatos: boolean = false;
  mostrarOtroCampo = false;
  mostrarInvolucrados = false;
  mostrarOtro = false;

  esCargoAdministrador: boolean = false;
  esCargoSecretario: boolean = false;
  esCargoDirector: boolean = false;
  esCargoApoyo: boolean = false;
  esCargoEncargado: boolean = false;
  esCargomonitoreo: boolean = false;
  esCargoTecnologia: boolean = false;
  esCargoMarketing: boolean = false;
  esCargoTextil: boolean = false;
  esCargoArtesania: boolean = false;
  esCargoAlimento: boolean = false;
  esCargoChofer: boolean = false;
  esCargoPasante: boolean = false;

  imagenEmpresa: any[];
  imagenEmpresas: { [key: number]: { filename: string, data: any, mimeType: string } } = {};

  pdfUrl: SafeResourceUrl | null = null;


  constructor(
    private _accesoService: AccesoService,
    private _usuariosService: UsuariosService,
    private _personasService: PersonasService,
    private _documentoService: TiposdocumentosService,
    private _extensionesService: TiposextensionesService,
    private _generosService: TiposgenerosService,
    private _rolService: RolesService,
    private _empresasService: EmpresasService,
    private _rubrosService: RubrosService,
    private _subrubrosService: SubrubrosService,
    private _municipiosService: MunicipiosService,
    private _localidadesService: LocalidadesService,
    private _representantesService: RepresentantesService,
    private _asociacionesService : AsociacionesService,
    private _beneficiosempresasService: BeneficiosempresasService,
    private _fb: FormBuilder,
    private _fbE: FormBuilder,
    private _fbR: FormBuilder,
    private _modalService: NgbModal,
    private toast: ToastrService,
    private _mensajes: ToastrService,
    private sanitizer: DomSanitizer,
    private utilsService: UtilsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.formEmpresa = this._fbE.group({
      idrepresentante: [''],
      copiarDatos: [false],
      nform: [''],
      fechareg: [''],
      empresa: [''],
      razonsocial: [''],
      nit: [''],
      bancamovil: [false],
      descripcion: [''],
      idsociacion: [''],
      celular: [''],
      idrubro: [''],
      servicios: [''],
      capacidad: [''],
      unidadmedida: [''],
      fechaapertura: [''],
      motivo: [''],
      otromotivo: [''],
      familiar: [false],
      involucrados: [''],
      otrosinvolucrados: [''],
      trabajadores: [''],
      participacion: [''],
      capacitacion: [''],
      idmunicipio: [''],
      zona: [''],
      direccion: [''],
      referencia: [''],
      transporte: [''],
      correo: [''],
      facebook: [''],
      twitter: [''],
      instagram: [''],
      paginaweb: [''],
      latitud: [''],
      longitud: [''],
    });

    this.formRep = this._fbR.group({
      primerapellido: [''],
      segundopellido: [''],
      primernombre: [''],
      idtipogenero: [''],
      idtipodocumento: [''],
      dip: [''],
      complementario: [''],
      idtipoextension: [''],
      formacion: [''],
      estadocivil: [''],
      hijos: [''],
      celular: [''],
      telefono: [''],
      direccion: [''],
      correo: [''],
      usuario: [''],
      clave: ['']

    });
    this.fdatos();
    this.frubros();
    this.fmunicipios();
    this.fasociaciones();
    this.frepresentantes();

    this.esCargoAdministrador = this._accesoService.esCargoAdministrador();
    this.esCargoSecretario = this._accesoService.esCargoSecretario();
    this.esCargoDirector = this._accesoService.esCargoDirector();
    this.esCargoApoyo = this._accesoService.esCargoApoyo();
    this.esCargoEncargado = this._accesoService.esCargoEncargado();
    this.esCargomonitoreo = this._accesoService.esCargoMonitoreo();
    this.esCargoTecnologia = this._accesoService.esCargoTecnologia();
    this.esCargoMarketing = this._accesoService.esCargoMarketing();
    this.esCargoTextil = this._accesoService.esCargoTextil();
    this.esCargoArtesania = this._accesoService.esCargoArtesania();
    this.esCargoAlimento = this._accesoService.esCargoAlimentos();
    this.esCargoChofer = this._accesoService.esCargoChofer();
  }

  copiarDatosRepresentante(copiar: boolean) {
    if (this.representante == null) {
      swal.fire({
        title: 'No hay datos',
        icon: 'error',
        text: 'Faltan datos de Representante',
        confirmButtonText: 'Aceptar',
        customClass: {
          confirmButton: 'btn btn-success rounded-pill mr-3',
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          this.goToStep(1);
          this.formEmpresa.value.copiarDatos = false;
        }
      });
    }else if (copiar && this.representante) {
      const idrepresentante = `${this.representante?.idrepresentante}`;
      const nombreCompleto = `${this.representante?.persona?.primerapellido} ${this.representante?.persona?.segundoapellido} ${this.representante?.persona?.primernombre}`;
      const celular = `${this.representante?.persona?.celular}`;
      const direccion = `${this.representante?.persona?.direccion}`;
      this.formEmpresa.patchValue({
        idrepresentante: idrepresentante,
        empresa: nombreCompleto,
        razonsocial: nombreCompleto,
        direccion: direccion,
        celular: celular
      });
    } else {
      this.formEmpresa.patchValue({
        idrepresentante: '',
        empresa: '',
        razonsocial: '',
        direccion: '',
        celular: ''
      });
    }
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
    if (this.stepRep < 5) {
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

  getFormControls(): string[] {
    return Object.keys(this.formEmpresa.controls);
  }
  getFormControlsRep(): string[] {
    return Object.keys(this.formRep.controls);
  }

  finish() {
    alert('Wizard completed!');
  }

  fmunicipios(){
    this._municipiosService.datosl().subscribe((data) => {
      this.municipios = data;
    });
  }

  // flocalidades(id: number) {
  //   this._localidadesService.datosl(id).subscribe( data => {
  //     this.localidades = data;
  //   });
  // }

  frubros(){
    this.esCargoTextil = this._accesoService.esCargoTextil();
    this.esCargoArtesania = this._accesoService.esCargoArtesania();
    this.esCargoAlimento = this._accesoService.esCargoAlimentos();

    if (this.esCargoTextil) {
      this._rubrosService.datoslrubro('TEXTIL').subscribe((data) => {
        this.rubros = data;
      });
    }else if (this.esCargoArtesania) {
      this._rubrosService.datoslrubro('ARTESANIAS').subscribe((data) => {
        this.rubros = data;
      });
    }else if (this.esCargoAlimento) {
      this._rubrosService.datoslrubro('ALIMENTOS').subscribe((data) => {
        this.rubros = data;
      })
    }else{
      this._rubrosService.datosl().subscribe((data) => {
        this.rubros = data;
      })
    }
  }

  // fsubrubros(id: number) {
  //   this._subrubrosService.datosl(id).subscribe( data => {
  //     this.subrubros = data;
  //   });
  // }

  fasociaciones() {
    this._asociacionesService.datosl().subscribe( data => {
      this.asociaciones = data;
    });
  }

  fbuscarRep(){
    if (this.buscarRep.trim().length > 0) {
      this.frepresentantes();
    }else{
      this.representantes = [];
      this.representante = null;
    }
  }

  flimpiar(){
    this.buscarRep = '';
    this.representantes = [];
    this.representante = null;
    this.mostrarOtro = null;
    this.mostrarOtroCampo = null;
  }

  flimpiarbuscar(){
    this.buscarRep = '';
    this.representante = null;
  }

  frepresentantes() {
    this._representantesService.buscar(this.buscarRep).subscribe( data => {
      this.representantes = data;
    });
  }

  onSelect(nombre: string){
    const repSeleccionado = this.representantes.find(rep => {
      return (
        `${rep.persona.primerapellido} ${rep.persona.segundoapellido} ${rep.persona.primernombre}` === nombre
      );
    });

    if (repSeleccionado) {
      this.fselrepresentante(repSeleccionado.idrepresentante);
    }
  }
  fselrepresentante(id: number){
    if (this.estado === 'Adicionar') {
      this._empresasService.verificar(id).pipe(
        switchMap(empresasRegistradas => {
          if (empresasRegistradas === 0) {
            return this._representantesService.dato(id);
          } else {
            swal.fire({
              icon: 'info',
              title: 'Información',
              text: `El representante ya tiene ${empresasRegistradas} empresas registradas.`,
              confirmButtonText: 'Aceptar',
              customClass: {
                confirmButton: 'btn btn-success rounded-pill mr-3',
              },
              buttonsStyling: false,
            });
            this.toast.error('El representante ya tiene empresas registradas', 'Operación fallida');
            this.buscarRep = '';
            return EMPTY;
          }
        })
      ).subscribe(
        data => {
          if (data) {
              this.representante = data;
              this.fdescargar(data.persona.idpersona, 'repanverso');
              this.fdescargar(data.persona.idpersona, 'repreverso');
          }
        }, (error) => {
          this.toast.error(error, 'Error');
        }
      );
    }else{
      this._representantesService.dato(id).subscribe((data) => {
        this.representante = data;
        this.fdescargar(data.persona.idpersona, 'repanverso');
        this.fdescargar(data.persona.idpersona, 'repreverso');
      });
    }
  }

  fcantidad() {
    this._empresasService.cantidad(this.buscar, this.rubro).subscribe((data) => {
      this.total = data;
    });
  }

  fbuscar() {
    this.pagina = 0;
    this.fdatos();
  }

  fdatos() {
    this.utilsService.mostrarCargando();
    this.esCargoTextil = this._accesoService.esCargoTextil();
    this.esCargoArtesania = this._accesoService.esCargoArtesania();
    this.esCargoAlimento = this._accesoService.esCargoAlimentos();
    this.esCargoTecnologia = this._accesoService.esCargoTecnologia();
    this.esCargoEncargado = this._accesoService.esCargoEncargado();
    this.esCargoAdministrador = this._accesoService.esCargoAdministrador();
    if (this.esCargoTextil) {
      this.rubro = 'TEXTIL';
    }else if (this.esCargoArtesania) {
      this.rubro = 'ARTESANIA';
    }else if(this.esCargoAlimento){
      this.rubro = 'ALIMENTOS';
    }else{
      this.rubro = ''
    }
    this._empresasService.datos(this.pagina, this.cantidad, this.buscar, this.rubro).subscribe(
      (data) => {
        this.fcantidad();
        this.datos = data;
        this.utilsService.cerrarCargando();
      },
      (error) => {
        swal.fire('Error', error, 'error');
        this.toast.error('Error en la carga de datos', 'Error');
        this.utilsService.cerrarCargando();
        this.router.navigate(['/acceso']);
      }
    );
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

  fformRep(dato: Personas, disabled: boolean = false) {
    this.formRep = this._fbR.group({
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
        dato.idtipogenero,
        [
          Validators.required
        ]
      ],
      idtipodocumento: [
        dato.idtipodocumento,
        [
          Validators.required
        ]
      ],
      dip: [
        dato.dip,
        [
          Validators.required,
          Validators.pattern('^[0-9]+$'),
          Validators.minLength(5),
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
        dato.idtipoextension,
        [
          Validators.required
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
      celular: [
        dato.celular,
        [
          //Validators.required,
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
          //Validators.required,
          Validators.pattern('^[a-zA-Z0-9\u00f1\u00d1\\s.,#-]+$'),
          Validators.minLength(5),
          Validators.maxLength(255)
        ],
      ],
      correo: [
        dato.correo,
        [
          Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'),
          Validators.minLength(5),
          Validators.maxLength(255)
        ],
      ],
      usuario: [
        dato.usuario.usuario,
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9\u00f1\u00d1]+$'),
          Validators.maxLength(10)
        ]
      ],
      clave: [
        dato.usuario.clave ? '**********' : '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20)
        ]
      ]
    });
    this.formRep.get('primerapellido')?.valueChanges.subscribe(() => this.generateUserAndPassword());
    this.formRep.get('segundoapellido')?.valueChanges.subscribe(() => this.generateUserAndPassword());
    this.formRep.get('primernombre')?.valueChanges.subscribe(() => this.generateUserAndPassword());
    this.formRep.get('dip')?.valueChanges.subscribe(() => this.generateUserAndPassword());
  }

  generateUserAndPassword() {
    const primerApellido = this.formRep.get('primerapellido')?.value || '';
    const segundoApellido = this.formRep.get('segundoapellido')?.value || '';
    const primerNombre = this.formRep.get('primernombre')?.value || '';
    const dip = this.formRep.get('dip')?.value || '';

    let parteUsuario = '';
    if (segundoApellido) {
        parteUsuario = primerApellido.slice(0, 2) + segundoApellido.slice(0, 2) + primerNombre.slice(0, 2);
    } else {
        parteUsuario = primerApellido.slice(0, 4) + primerNombre.slice(0, 2);
    }

    const parteDIP = dip.slice(-3);

    const usuario = parteUsuario.toLowerCase() + parteDIP;
    const clave = parteUsuario.toLowerCase() + parteDIP;
    this.formRep.patchValue({
      usuario: usuario,
      clave: clave
    });
  }

  get fR() { return this.formRep.controls; }

  fformEmpresa(dato: Empresas) {
    this.formEmpresa = this._fbE.group({
      copiarDatos: [false],
      idrepresentante: [
        dato.representante?.idrepresentante,
        [
          Validators.required
        ]
      ],
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
    this.formEmpresa.get('fechareg')?.valueChanges.subscribe(() => this.generateFormEmpresa());
    this.formEmpresa.get('idrubro')?.valueChanges.subscribe(() => this.generateFormEmpresa());
    this.formEmpresa.get('copiarDatos')?.valueChanges.subscribe((value) => {
      this.copiarDatosRepresentante(value);
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
        this.mostrarInvolucrados = false;
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

  generateFormEmpresa() {
    const programa = 'RTIC';

      const rubroSelect = this.formEmpresa.get('idrubro')?.value || '';

      let rubroAbrev = '';

      switch (rubroSelect) {
        case '1':
          rubroAbrev = 'ARTES';
          break;
        case '2':
          rubroAbrev = 'TXTIL';
          break;
        case '3':
          rubroAbrev = 'ALMTS';
          break;
        default:
          rubroAbrev = rubroSelect;
          break;
      }

      const fechaReg = this.formEmpresa.get('fechareg')?.value || '';
      const año = fechaReg ? fechaReg.slice(0, 4) : '0000';

      // Retornar la cadena generada
      const codigoFormulario = `${programa}-${rubroAbrev}-${año}-0000`;

      this.formEmpresa.patchValue({
        nform: codigoFormulario,
      });
  }

  get f() { return this.formEmpresa.controls; }

  onInput(event: any, controlName: string, type: 'letras' | 'letrasyespacios' | 'numeros' | 'letrasynumerosguion' | 'direccion' | 'formulario'): void {
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
        input = input.replace(/[^a-zA-ZÀ-ÿ0-9\u00f1\u00d1\s.,&-]/g, '');
        break;
      case 'direccion':
        input = input.replace(/[^a-zA-Z0-9\u00f1\u00d1\s.,#-]/g, '');
        break;
      case 'formulario':
        input = input.replace(/[^a-zA-Z0-9-]/g, '');
        break;
    }
    if (this.formEmpresa.get(controlName)) {
      this.formEmpresa.get(controlName)?.setValue(input.toUpperCase(), { emitEvent: false });
    }
    if (this.formRep.get(controlName)) {
      this.formRep.get(controlName)?.setValue(input.toUpperCase(), { emitEvent: false });
    }
  }

  onInputRep(event: any): void {
    let inputValue = event.target.value;

    inputValue = inputValue.toUpperCase().replace(/[^a-zA-ZÀ-ÿ0-9\u00f1\u00d1\s]/g, '');

    this.buscarRep = inputValue;
  }
  onInputEmp(event: any): void {
    let inputValue = event.target.value;

    inputValue = inputValue.toUpperCase().replace(/[^a-zA-ZÀ-ÿ\u00f1\u00d1\s]/g, '');

    this.buscar = inputValue;
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

  fextra(){
    this.fdocumento();
    this.fextension();
    this.fgenero();
  }

  fadicionar(content: any) {
    this.estado = 'Adicionar';
    this.dato = new Empresas();
    this.fextra();
    this.goToStep(1);
    this.fformEmpresa(this.dato);
    this.modalRefEmpresa = this._modalService.open(content, {
      backdrop: 'static',
      keyboard: false,
      size: 'lg',
      scrollable: true
    });
  }

  fadicionRep(content: any){
    this.estado = 'Adicionar';
    this.persona = new Personas();
    this.persona.usuario = new Usuarios();
    this.goToStepRep(1);
    this.fformRep(this.persona);
    this.modalRefPersona = this._modalService.open(content, {
      backdrop: 'static',
      keyboard: false,
      size: 'lg'
    })
  }

  fmodificar(id: number, content: any) {
    this.utilsService.mostrarCargando();
    this.estado = 'Modificar';
    this.goToStep(1);
    this._empresasService.dato(id).subscribe((data) => {
      this.dato = data;
      this.fformEmpresa(this.dato);
      this.fselrepresentante(this.dato.representante.idrepresentante);
      this.frubros();
      if (data.otromotivo) {
        this.mostrarOtroCampo = true;
      }
      if (data.familiar) {
        this.mostrarInvolucrados = true;
      }
      if (data.otrosinvolucrados) {
        this.mostrarOtro = true;
      }
      this.modalRefEmpresa = this._modalService.open(content, {
        backdrop: 'static',
        keyboard: false,
        size: 'lg',
        scrollable: true
      });
      this.utilsService.cerrarCargando();
    });
  }

  fver(id: number, content: any) {
    this.utilsService.mostrarCargando();
    this.estado = 'Ver';
    this._empresasService.dato(id).subscribe((data) => {
      this.dato = data;
      this.fdescargar(data.idempresa, 'empresas');
      this.fdescargar(data.representante?.persona?.idpersona, 'repanverso');
      this.fdescargar(data.representante?.persona?.idpersona, 'repreverso');
      this.modalRefEmpresa = this._modalService.open(content, {
        backdrop: 'static',
        keyboard: false,
        size: 'xl',
        scrollable: true
      });
      this.utilsService.cerrarCargando();
    })
  }

  flimpiarbuscarbeneficios(){
    this.buscarbeneficio = '';
    this.fdatosbeneficios(this.dato.idempresa);
  }

  fbuscarbeneficios() {
    this.fdatosbeneficios(this.dato.idempresa);
  }

  fcantidadbe(id: number){
    this._beneficiosempresasService.cantidadbe(this.buscarbeneficio, id).subscribe(data => {
      this.totalbe = data;
    });
  }

  fdatosbeneficios(id: number) {
    this._beneficiosempresasService.beneficios(this.buscarbeneficio, id).subscribe((data) => {
      this.beneficiosempresas = data;
      this.fcantidadbe(id);
    });
  }

  fbeneficios(id: number, content: any){
    this._empresasService.dato(id).subscribe((data) => {
      this.dato = data;
      this.buscarbeneficio = '';
      this.fdatosbeneficios(id);
      this.modalRefEmpresa = this._modalService.open(content, {
        backdrop: 'static',
        keyboard: false,
        scrollable: true,
        size: 'lg'
      });
    });
  }

  faceptar(): void {
    this.submitted = true;

    this.dato.idrubro = this.formEmpresa.value.idrubro;
    this.dato.idmunicipio = this.formEmpresa.value.idmunicipio;
    this.dato.idrepresentante = this.formEmpresa.value.idrepresentante;
    this.dato.idasociacion = this.formEmpresa.value.idasociacion;
    this.dato.empresa = this.formEmpresa.value.empresa;
    this.dato.descripcion = this.formEmpresa.value.descripcion;
    this.dato.tipo = 'EMPRESA';
    this.dato.direccion = this.formEmpresa.value.direccion;
    this.dato.telefono = this.formEmpresa.value.telefono;
    this.dato.celular = this.formEmpresa.value.celular;
    this.dato.correo = this.formEmpresa.value.correo;
    this.dato.facebook = this.formEmpresa.value.facebook;
    this.dato.twitter = this.formEmpresa.value.twitter;
    this.dato.instagram = this.formEmpresa.value.instagram;
    this.dato.paginaweb = this.formEmpresa.value.paginaweb;
    this.dato.nform = this.formEmpresa.value.nform;
    this.dato.latitud = this.formEmpresa.value.latitud;
    this.dato.longitud = this.formEmpresa.value.longitud;
    this.dato.nit = this.formEmpresa.value.nit;
    this.dato.bancamovil = this.formEmpresa.value.bancamovil;
    this.dato.fechaapertura = this.formEmpresa.value.fechaapertura;
    this.dato.servicios = this.formEmpresa.value.servicios;
    this.dato.capacidad = this.formEmpresa.value.capacidad;
    this.dato.unidadmedida = this.formEmpresa.value.unidadmedida;
    this.dato.motivo = this.formEmpresa.value.motivo;
    this.dato.otromotivo = this.formEmpresa.value.otromotivo;
    this.dato.familiar = this.formEmpresa.value.familiar;
    this.dato.involucrados = this.formEmpresa.value.involucrados;
    this.dato.otrosinvolucrados = this.formEmpresa.value.otrosinvolucrados;
    this.dato.trabajadores = this.formEmpresa.value.trabajadores;
    this.dato.participacion = this.formEmpresa.value.participacion;
    this.dato.capacitacion = this.formEmpresa.value.capacitacion;
    this.dato.zona = this.formEmpresa.value.zona;
    this.dato.referencia = this.formEmpresa.value.referencia;
    this.dato.transporte = this.formEmpresa.value.transporte;
    this.dato.fechareg = this.formEmpresa.value.fechareg;
    this.dato.razonsocial = this.formEmpresa.value.razonsocial;
    this.dato.registrosenasag = this.formEmpresa.value.registrosenasag;

    if (this.estado === 'Modificar') {
      this.dato.idempresa = this.dato.idempresa;

      this._empresasService.modificar(this.dato).subscribe((data) => {
        this.fdatos();
        this.flimpiarbuscar()
        this.modalRefEmpresa.dismiss();
        swal.fire('Dato modificado', 'Dato modificado con exito', 'success');
      });
    } else {
      this._empresasService.adicionar(this.dato).subscribe((data) => {
        this.fdatos();
        this.flimpiarbuscar()
        this.mostrarOtro = null;
        this.mostrarOtroCampo = null;
        this.modalRefEmpresa.dismiss();
        swal.fire('Dato adicionado', 'Dato modificado con exito', 'success');
      });
    }
  }

  faceptarRep(): void {
    function toUpperCaseDefined(value: string | undefined): string {
      return value ? value.toUpperCase() : '';
    }
    this.submitted = true;

    this.persona.primerapellido = toUpperCaseDefined(this.formRep.value.primerapellido);
    this.persona.segundoapellido = toUpperCaseDefined(this.formRep.value.segundoapellido);
    this.persona.primernombre = toUpperCaseDefined(this.formRep.value.primernombre);
    this.persona.idtipogenero = this.formRep.value.idtipogenero;
    this.persona.idtipodocumento = this.formRep.value.idtipodocumento;
    this.persona.dip = this.formRep.value.dip;
    this.persona.complementario = toUpperCaseDefined(this.formRep.value.complementario);
    this.persona.idtipoextension = this.formRep.value.idtipoextension;
    this.persona.direccion = this.formRep.value.direccion;
    this.persona.telefono = this.formRep.value.telfono;
    this.persona.celular = this.formRep.value.celular;
    this.persona.correo = this.formRep.value.correo;
    this.persona.formacion = this.formRep.value.formacion;
    this.persona.estadocivil = this.formRep.value.estadocivil;
    this.persona.hijos = this.formRep.value.hijos;
    this.persona.usuario.usuario = this.formRep.value.usuario;
    this.persona.usuario.clave = this.formRep.value.clave;

    if (this.estado = 'Adicionar') {
      this._personasService.adicionar2(this.persona).subscribe((data) => {
        this.modalRefPersona.dismiss();
        swal.fire('Exito', 'Representante registrado con éxito', 'success');
      })
    }
  }

  fseleccionarArchivo(event) {
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

  fimagenEmp(contenido: any) {
    this.estado = 'Empresa';
    this.modalRefPersona = this._modalService.open(contenido, {
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
    if (this.estado === 'Formulario A') {
      this._empresasService.upload(this.dato?.idempresa.toString(), 'formularioA', this.archivoSeleccionado).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          const progreso = Math.round((event.loaded / event.total) * 100);
          swal.getHtmlContainer().querySelector('b').textContent = `${progreso}%`;
        } else if (event.type === HttpEventType.Response) {
          swal.close();
          this.fdescargar(this.dato?.idempresa, 'empresas')
          this.fdatos();
          swal.fire('Archivo cargado', 'Archivo cargado con éxito', 'success');
          this.modalRefPersona.dismiss();
          this.archivoSeleccionado = null;
        }
      }, error => {
        swal.close();
        swal.fire('Error', 'Ocurrió un error durante la subida, por favor contacte al ADMINISTRADOR', 'error');
      });
    }else if (this.estado === 'Formulario B') {
      this._empresasService.upload(this.dato?.idempresa.toString(), 'formularioB', this.archivoSeleccionado).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          const progreso = Math.round((event.loaded / event.total) * 100);
          swal.getHtmlContainer().querySelector('b').textContent = `${progreso}%`;
        } else if (event.type === HttpEventType.Response) {
          swal.close();
          this.fdescargar(this.dato?.idempresa, 'empresas')
          this.fdatos();
          swal.fire('Archivo cargado', 'Archivo cargado con éxito', 'success');
          this.modalRefPersona.dismiss();
          this.archivoSeleccionado = null;
        }
      }, error => {
        swal.close();
        swal.fire('Error', 'Ocurrió un error durante la subida, por favor contacte al ADMINISTRADOR', 'error');
      });
    }else {
      this._empresasService.upload(this.dato?.idempresa.toString(), 'empresas', this.archivoSeleccionado).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          const progreso = Math.round((event.loaded / event.total) * 100);
          swal.getHtmlContainer().querySelector('b').textContent = `${progreso}%`;
        } else if (event.type === HttpEventType.Response) {
          swal.close();
          this.fdescargar(this.dato?.idempresa, 'empresas')
          this.fdatos();
          swal.fire('Archivo cargado', 'Archivo cargado con éxito', 'success');
          this.modalRefPersona.dismiss();
          this.archivoSeleccionado = null;
        }
      }, error => {
        swal.close();
        swal.fire('Error', 'Ocurrió un error durante la subida, por favor contacte al ADMINISTRADOR', 'error');
      });
    }
  }

  fdescargar(id: number, rol: string) {
    if (rol == 'empresas') {
      this.imagenEmpresa = [];
      this._empresasService.download(id, 'empresas').subscribe((data) => {
        this.imagenEmpresa = data;
      });
    }
    if (rol == 'repanverso') {
      this.imagenRepAnverso = [];
      this._personasService.download(id, 'repanverso').subscribe((data) => {
        this.imagenRepAnverso = data;
      });
    }
    if (rol == 'repreverso') {
      this.imagenRepReverso = [];
      this._personasService.download(id, 'repreverso').subscribe((data) => {
        this.imagenRepReverso = data;
      });
    }
  }

  sanitizarImagen(data: string, mimeType: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(`data:${mimeType};base64,${data}`);
  }

  fcancelar() {
    if (this.modalRefEmpresa) {
      this.modalRefEmpresa.dismiss();
      this.flimpiar();
    }
  }

  fcancelarRep(){
    if (this.modalRefPersona) {
      this.modalRefPersona.dismiss();
      this.archivoSeleccionado = null;
    }
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
        customClass: {
          confirmButton: 'btn btn-success rounded-pill mr-3',
          cancelButton: 'btn btn-secondary rounded-pill',
        },
        buttonsStyling: false,
      })
      .then((result) => {
        if (result.value) {
          // this._empresasService.eliminar(id).subscribe((data) => {
          //   this.fdatos();
          // });
          swal.fire('Error', 'Procedimiento NO autorizado, por favor contacte al Administrador', 'error');
        }
      });
  }

  fcambiarestado(idempresa: number, estado: boolean){
    swal.fire({
      title: !estado ? '¿Está seguro de deshabilitar?' : '¿Está seguro de habilitar?',
      icon: 'warning',
      text: !estado ? 'La Unidad Productiva NO se podrá utilizar para registros.' : 'La Unidad Productiva se podrá utilizar para registros.',
      showCancelButton: true,
      cancelButtonText: 'cancelar',
      confirmButtonText: 'Cambiar',
      customClass: {
        confirmButton: 'btn btn-success rounded-pill mr-3',
        cancelButton: 'btn btn-secondary rounded-pill',
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        // this._localicadesService.cambiarestado({ idlocalidad, estado }).subscribe( response => {
        //   this.fdatos();
        //   swal.fire('Cambio realizado', 'El estado de la localidad ha sido cambiado con éxito.', 'success');
        // });
        swal.fire('Error', 'Procedimiento NO autorizado, por favor contacte al Administrador', 'error');
      }
    });
  }

  fdatosXLS() {
    // this._empresasService.datosXLS(this.buscar).subscribe(data => {
    //   const url = window.URL.createObjectURL(data);
    //   const a = document.createElement("a");
    //   a.setAttribute("style", "display:none;");
    //   document.body.appendChild(a);
    //   a.href = url;
    //   a.download = "datos.xlsx";
    //   a.click();
    //   return url;
    // });
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

  fcambiarimagen(contenido: any) {
    this.estado = 'Actualizar';
    this.modalRefPersona =  this._modalService.open(contenido, {
      backdrop: 'static',
      keyboard: false
    });
  }

  fimagenFormA(contenido: any) {
    this.estado = 'Formulario A';
    this.modalRefPersona = this._modalService.open(contenido, {
      backdrop: 'static',
      keyboard: false
    });
  }
  fimagenFormB(contenido: any) {
    this.estado = 'Formulario B';
    this.modalRefPersona = this._modalService.open(contenido, {
      backdrop: 'static',
      keyboard: false
    });
  }

  fimprimir(id: number, tipo: string, content: any){
    this.estado = tipo;
    this.utilsService.mostrarCargando();
    if (this.estado === 'Carnet') {
      this._personasService.documentoPDF(id, 'carnet').subscribe(
        data => {
          const url = window.URL.createObjectURL(data);
          this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
          this.modalRefCarnet =  this._modalService.open(content, {
            backdrop: 'static',
            keyboard: false,
            size: 'xl'
          });
          this.utilsService.cerrarCargando();
        },
        error => {
          const mensaje = error.error?.mensaje || 'Error desconocido. Intente nuevamente o consulte con el Administrador.';
          this.utilsService.cerrarCargando();
          // Mostramos el SweetAlert con el mensaje de error
          swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: mensaje,
            confirmButtonText: 'Aceptar'
          });
          this.toast.error('', 'Error desconocido');
        }
      );
    }
    if (this.estado == 'Formulario') {
      this._empresasService.documentoPDF(id, 'formulario').subscribe(
        data => {
          const url = window.URL.createObjectURL(data);
          this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
          this.modalRefCarnet =  this._modalService.open(content, {
            backdrop: 'static',
            keyboard: false,
            size: 'xl'
          });
          this.utilsService.cerrarCargando();
        },
        error => {
          const mensaje = error.error?.mensaje || 'Error desconocido. Intente nuevamente o consulte con el Administrador.';
          this.utilsService.cerrarCargando();
          // Mostramos el SweetAlert con el mensaje de error
          swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: mensaje,
            confirmButtonText: 'Aceptar'
          });
          this.toast.error('', 'Error desconocido');
        }
      );
    }
  }


}

