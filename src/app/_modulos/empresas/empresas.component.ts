import { RepresentantesService } from './../../_aods/representantes.service';
import { AsociacionesService } from 'src/app/_aods/asociaciones.service';
import { Representantes } from './../../_entidades/representantes';
import { Asociaciones } from './../../_entidades/asociaciones';
import { LocalidadesService } from 'src/app/_aods/localidades.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal, NgbModalConfig, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
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

@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.css']
})
export class EmpresasComponent implements OnInit {

  ruta = `${RUTA}/catalogos/descargarempresa/`;

  archivoseleccionado: File;

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

  pagina:number = 0;
  numPaginas:number = 0;
  cantidad:number = 10;
  buscar:string = '';
  buscarRep:string = '';
  total:number = 0;
  estado:string = '';

  formEmpresa: FormGroup;
  formRep: FormGroup;
  submitted: boolean = false;

  imagen: any;

  imageSrc: string;

  modalRefEmpresa: NgbModalRef;
  modalRefPersona: NgbModalRef;

  step: number = 1;

  formacionMap: { [key: number]: string } = {
    1: 'Inicial',
    2: 'Primaria',
    3: 'Secundaria',
    4: 'Técnico',
    5: 'Licenciatura'
  };

  estadocivilMap: { [key: number]: string } = {
    1: 'Soltero(a)',
    2: 'Casado(a)',
    3: 'Viudo(a)',
    4: 'Conviviente',
    5: 'Separado(a)'
  }

  hijosMap: { [key: number]: string } = {
    0: 'Sin Hijos',
    1: '1 Hijo',
    2: '2 Hijos',
    3: '3 Hijos',
    4: '4 Hijos',
    5: '5 a mas Hijos'
  }

  //copiarDatos: boolean = false;
  mostrarOtroCampo = false;
  mostrarInvolucrados = false;
  mostrarOtro = false;

  constructor(
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
    private _fb: FormBuilder,
    private _fbE: FormBuilder,
    private _fbR: FormBuilder,
    private _modalService: NgbModal,
    private _mensajes: ToastrService,
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
      idsubrubro: [''],
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
      idlocalidad: [''],
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
      usuario: [''],
      clave: ['']

    });
    // this.formEmpresa.get('copiarDatos')?.valueChanges.subscribe((value) => {
    //   this.copiarDatosRepresentante(value);
    // });
    this.fdatos();
    this.frubros();
    this.fmunicipios();
    this.fasociaciones();
    this.frepresentantes();
  }

  copiarDatosRepresentante(copiar: boolean) {
    if (this.representante == null) {
      swal.fire({
        title: 'No hay datos',
        icon: 'error',
        text: 'Faltan datos de Representante',
        confirmButtonText: 'Aceptar',
      }).then((result) => {
        if (result.value) {
          this.goToStep(1);

        }
      });
    }else if (copiar && this.representante) {
      const idrepresentante = `${this.representante?.idrepresentante}`;
      const nombreCompleto = `${this.representante?.persona?.primerapellido} ${this.representante?.persona?.segundoapellido} ${this.representante?.persona?.primernombre}`;
      const celular = `${this.representante?.persona?.celular}`;
      this.formEmpresa.patchValue({
        idrepresentante: idrepresentante,
        empresa: nombreCompleto,
        razonsocial: nombreCompleto,
        celular: celular
      });
    } else {
      this.formEmpresa.patchValue({
        idrepresentante: '',
        empresa: '',
        razonsocial: '',
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

  finish() {
    alert('Wizard completed!');
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
    this._representantesService.dato(id).subscribe((data) => {
      this.representante = data;
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
          Validators.required,
          Validators.pattern('^[0-9]+$'),
          Validators.maxLength(15)
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

    const parteUsuario = primerApellido.slice(0, 2) + segundoApellido.slice(0, 2) + primerNombre.slice(0, 2);

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
        dato.idrepresentante,
        [
          Validators.required
        ]
      ],
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
          Validators.required,
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
        dato.direccion
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
    this.formEmpresa.get('copiarDatos')?.valueChanges.subscribe((value) => {
      this.copiarDatosRepresentante(value);
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

    // Escuchar cambios en el select "Involucrados"
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

  get f() { return this.formEmpresa.controls; }

  onInput(event: any, controlName: string, type: 'letras' | 'letrasyespacios' | 'numeros' | 'letrasynumerosguion' | 'direccion'): void {
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
        input = input.replace(/[^a-zA-Z0-9\u00f1\u00d1\s&.]/g, '');
        break;
      case 'direccion':
        input = input.replace(/[^a-zA-Z0-9\u00f1\u00d1\s.,#-]/g, '');
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

    inputValue = inputValue.toUpperCase().replace(/[^a-zA-ZÀ-ÿ\u00f1\u00d1\s]/g, '');

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
      size: 'lg'
    });
  }

  fadicionRep(content: any){
    this.estado = 'Adicionar';
    this.persona = new Personas();
    this.persona.usuario = new Usuarios();
    this.fformRep(this.persona);
    this.modalRefPersona = this._modalService.open(content, {
      backdrop: 'static',
      keyboard: false,
      size: 'lg'
    })
  }

  fmodificar(id: number, content: any) {
    this.estado = 'Modificar';
    this.goToStep(1);
    this._empresasService.dato(id).subscribe((data) => {
      this.dato = data;
      this.fselrepresentante(this.dato.idrepresentante);
      this.fformEmpresa(this.dato);
      this.modalRefEmpresa = this._modalService.open(content, {
        backdrop: 'static',
        keyboard: false,
        size: 'lg'
      });
    });
  }

  faceptar(): void {
    this.submitted = true;

    console.log('Formulario Valores:', this.formEmpresa.value);

    this.dato.idsubrubro = this.formEmpresa.value.idsubrubro;
    this.dato.idlocalidad = this.formEmpresa.value.idlocalidad;
    this.dato.idrepresentante = this.formEmpresa.value.idrepresentante;
    this.dato.idasociacion = this.formEmpresa.value.idasociacion;
    this.dato.empresa = this.formEmpresa.value.empresa;
    this.dato.descripcion = this.formEmpresa.value.descripcion;
    this.dato.tipo = 'EMPRESA';
    this.dato.direccion = this.formEmpresa.value.direccion;
    this.dato.telefono = this.formEmpresa.value.celular;
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

    //this.dato.registrosenasag = this.formEmpresa.value.registrosenasag;
    // if (this.estado === 'Modificar') {
    //   this._empresasService.modificar(this.dato).subscribe((data) => {
    //     this.fcargar(this.dato.idempresa);
    //     this.fdatos();
    //     this.modalRefEmpresa.dismiss();
    //     swal.fire('Dato modificado', 'Dato modificado con exito', 'success');
    //   });
    // } else {
    //   this._empresasService.adicionar(this.dato).subscribe((data) => {
    //     this.fcargar(this.dato.idempresa);
    //     this.fdatos();
    //     this.modalRefEmpresa.dismiss();
    //     swal.fire('Dato adicionado', 'Dato modificado con exito', 'success');
    //   });
    // }

    console.log(this.dato);

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
    this.persona.telefono = this.formRep.value.celular;
    this.persona.celular = this.formRep.value.celular;
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

  // fseleccionarArchivo(event) {
  //   const reader = new FileReader();
  //   this.archivoseleccionado = event.target.files[0];
  //   if (event.target.files[0] && event.target.files.length) {
  //     const file = event.target.files[0];
  //     reader.readAsDataURL(file);
  //     reader.onload = () => {
  //       this.imageSrc = reader.result as string;
  //     };
  //   }

  // }

  // fcargar(id: number) {
  //   this._empresasService.cargarImagene(this.archivoseleccionado, id).subscribe((data) => {
  //     this.fdatos();
  //   });
  // }

  fcancelar() {
    if (this.modalRefEmpresa) {
      this.modalRefEmpresa.dismiss();
      this.flimpiar();
    }
  }

  fcancelarRep(){
    if (this.modalRefPersona) {
      this.modalRefPersona.dismiss();
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

