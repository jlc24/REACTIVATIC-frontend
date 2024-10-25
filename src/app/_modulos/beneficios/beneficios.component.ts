import { HttpEventType } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AccesoService } from 'src/app/_aods/acceso.service';
import { AsistenciasService } from 'src/app/_aods/asistencias.service';
import { AsistenciasempresasService } from 'src/app/_aods/asistenciasempresas.service';
import { BeneficiosService } from 'src/app/_aods/beneficios.service';
import { BeneficiosempresasService } from 'src/app/_aods/beneficiosempresas.service';
import { EmpresasService } from 'src/app/_aods/empresas.service';
import { MunicipiosService } from 'src/app/_aods/municipios.service';
import { RepresentantesService } from 'src/app/_aods/representantes.service';
import { TiposbeneficiosService } from 'src/app/_aods/tiposbeneficios.service';
import { UsuariosService } from 'src/app/_aods/usuarios.service';
import { UtilsService } from 'src/app/_aods/utils.service';
import { Asistencias } from 'src/app/_entidades/asistencias';
import { Asistenciasempresas } from 'src/app/_entidades/asistenciasempresas';
import { Beneficios } from 'src/app/_entidades/beneficios';
import { Beneficiosempresas } from 'src/app/_entidades/beneficiosempresas';
import { Municipios } from 'src/app/_entidades/municipios';
import { Representantes } from 'src/app/_entidades/representantes';
import { Tiposbeneficios } from 'src/app/_entidades/tiposbeneficios';
import { Usuarios } from 'src/app/_entidades/usuarios';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-beneficios',
  templateUrl: './beneficios.component.html',
  styleUrls: ['./beneficios.component.css']
})
export class BeneficiosComponent implements OnInit {

  caracteresMaximos: number = 255;
  caracteresRestantes: number = this.caracteresMaximos;

  beneficios: Beneficios[];
  beneficio: Beneficios;
  beneficiosempresas: Beneficiosempresas[];
  beneficiosempresaslista: Beneficiosempresas[];
  cantidadbeneficio: number;
  representantes: Representantes[];
  tiposbeneficios: Tiposbeneficios[];
  municipios: Municipios[];
  capacitadores: Usuarios[];
  rol: string = '';
  asistencia: Asistencias;
  fechasasistencia: Asistenciasempresas[];
  asistenciasempresas: Asistenciasempresas[];

  pagina: number = 1;
  numPaginas: number = 0;
  cantidad: number = 10;
  buscar: string = '';
  total: number = 0;
  estado: string = '';
  estadotipo: string = '';

  paginaRep: number = 1;
  numPaginasRep: number = 0;
  cantidadRep: number = 10;
  buscarRep: string = '';
  totalRep: number = 0;

  paginaEmp: number = 1;
  numPaginasEmp: number = 0;
  cantidadEmp: number = 5;
  buscarEmp: string = '';
  totalEmp: number = 0;

  formulario: FormGroup;
  formAsistencia: FormGroup;
  submitted: boolean = false;

  modalRefBeneficio: NgbModalRef;
  modalRefImagen: NgbModalRef;
  modalRefPlanilla: NgbModalRef;

  convocatoria: any[];
  afiche: any[];

  @ViewChild('archivoInput') archivoInput: ElementRef;
  archivoSeleccionado: File = null;
  miniaturaUrl: string | ArrayBuffer = null;
  sizeFileFormat: string | null = null;
  cargando: boolean = false;
  progreso: number = 0;

  esadmin: boolean = false;
  essddpi: boolean = false;
  esdpeic: boolean = false;
  esreactivatic: boolean = false;

  esCargoTextil: boolean = false;
  esCargoArtesania: boolean = false;
  esCargoAlimento: boolean = false;
  esCargoTecnologia: boolean = false;
  esCargoEncargado: boolean = false;
  esCargoMarketing: boolean = false;
  esCapacitador: boolean = false;

  pdfUrl: SafeResourceUrl | null = null;

  constructor(
    private _accesoService: AccesoService,
    private _beneficiosService: BeneficiosService,
    private _beneficiosempresasService: BeneficiosempresasService,
    private _tiposbeneficiosService: TiposbeneficiosService,
    private _municipiosService: MunicipiosService,
    private _usuariosService: UsuariosService,
    private _representantesService: RepresentantesService,
    private _asistenciasService: AsistenciasService,
    private _asistenciasempresasService: AsistenciasempresasService,
    private utilsService: UtilsService,
    private _fB: FormBuilder,
    private _fBA: FormBuilder,
    private _modalService: NgbModal,
    private _toast: ToastrService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.fdatos();

    this.ftiposbeneficios();
    this.fmunicipios();
    this.fcapacitadores();

    this.esadmin = this._accesoService.esRolAdmin();
    this.essddpi = this._accesoService.esRolSddpi();
    this.esdpeic = this._accesoService.esRolDpeic();
    this.esreactivatic = this._accesoService.esRolReactivatic();

    this.esCargoTextil = this._accesoService.esCargoTextil();
    this.esCargoArtesania = this._accesoService.esCargoArtesania();
    this.esCargoAlimento = this._accesoService.esCargoAlimentos();
    this.esCargoTecnologia = this._accesoService.esCargoTecnologia();
    this.esCargoEncargado = this._accesoService.esCargoEncargado();
    this.esCargoMarketing = this._accesoService.esCargoMarketing();
    this.esCapacitador = this._accesoService.esCargoCapacitador();

    this.formAsistencia = this._fBA.group({
      idbeneficio: [''],
      dias: [''],
      diracion: ['']
    });

    this.formulario = this._fB.group({
      beneficio: [''],
      descripcion:[''],
      idtipobeneficio:[''],
      idmunicipio: [''],
      direccion:[''],
      fechainicio:[''],
      fechafin: [''],
      idcapacitador:[''],
      capacidad:[''],
    });
  }

  ftiposbeneficios(){
    this._tiposbeneficiosService.listar().subscribe((data) => {
      this.tiposbeneficios = data;
    })
  }

  fmunicipios(){
    this._municipiosService.datosl().subscribe((data) => {
      this.municipios = data;
    })
  }

  fcapacitadores(){
    this._usuariosService.lista().subscribe((data) => {
      this.capacitadores = data;
    })
  }

  fdatos(){
    this.esadmin = this._accesoService.esRolAdmin();
    this.essddpi = this._accesoService.esRolSddpi();
    this.esdpeic = this._accesoService.esRolDpeic();
    this.esCargoTecnologia = this._accesoService.esCargoTecnologia();
    this.esCargoEncargado = this._accesoService.esCargoEncargado();
    this.esCargoMarketing = this._accesoService.esCargoMarketing();
    this.esreactivatic = this._accesoService.esRolReactivatic();
    this.esCapacitador = this._accesoService.esCargoCapacitador();

    if (this.esadmin || this.essddpi || this.esdpeic || this.esCargoTecnologia || this.esCargoMarketing) {
      this.rol = 'admin';
    }else{
      this.rol = '';
    }

    this._beneficiosService.datos(this.pagina, this.cantidad, this.buscar, this.rol).subscribe((data) => {
      this.fcantidad();
      this.beneficios = data;
    })
  }

  fbuscar() {
    this.pagina = 0;
    this.fdatos();
  }

  fcantidad() {
    this.esadmin = this._accesoService.esRolAdmin();
    this.essddpi = this._accesoService.esRolSddpi();
    this.esdpeic = this._accesoService.esRolDpeic();
    this.esCargoTecnologia = this._accesoService.esCargoTecnologia();
    this.esCargoEncargado = this._accesoService.esCargoEncargado();
    this.esCargoMarketing = this._accesoService.esCargoMarketing();
    this.esreactivatic = this._accesoService.esRolReactivatic();
    this.esCapacitador = this._accesoService.esCargoCapacitador();

    if (this.esadmin || this.essddpi || this.esdpeic || this.esCargoTecnologia || this.esCargoMarketing) {
      this.rol = 'admin';
    }else{
      this.rol = '';
    }
    this._beneficiosService.cantidad(this.buscar, this.rol).subscribe((data) => {
      this.total = data;
    });
  }

  limpiar() {
    this.pagina = 0;
    this.buscar = '';
    this.fdatos();
  }

  mostrarMas(evento: any){
    this.pagina = evento;
    this.fdatos();
  }

  fformulario(beneficio: Beneficios, disabled: boolean = false){
    this.formulario = this._fB.group({
      beneficio: [
        beneficio.beneficio,
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9À-ÿ\u00f1\u00d1\\s.,-]+$'),
          Validators.minLength(5),
          Validators.maxLength(150)
        ]
      ],
      descripcion:[
        beneficio.descripcion,
        [
          Validators.maxLength(this.caracteresMaximos)
        ]
      ],
      idtipobeneficio:[
        beneficio.tipobeneficio?.idtipobeneficio,
        [
          Validators.required,
        ]
      ],
      idmunicipio: [
        beneficio.municipio?.idmunicipio,
        [
          Validators.required
        ]
      ],
      direccion:[
        beneficio.direccion,
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9À-ÿ\u00f1\u00d1\\s.,#-]+$'),
        ]
      ],
      fechainicio:[
        beneficio.fechainicio,
        [
          Validators.required
        ]
      ],
      fechafin: [
        beneficio.fechafin,
        [
          Validators.required
        ]
      ],
      idcapacitador:[
        beneficio.capacitador?.idusuario
      ],
      capacidad:[
        beneficio.capacidad,
        [
          Validators.required,
          Validators.pattern('^[0-9]+$'),
          Validators.minLength(1),
          Validators.maxLength(4)
        ]
      ],
    });

    this.formulario.get('descripcion').valueChanges.subscribe(value => {
      this.caracteresRestantes = this.caracteresMaximos - (value ? value.length : 0);
    });
  }

  get f() { return this.formulario.controls; }

  onInput(event: any, controlName: string, type: 'letras' | 'letrasyespacios' | 'numeros' | 'letrasynumerosguion' | 'direccion'): void {
    let input = event.target.value;
    switch (type) {
      case 'letras':
        input = input.replace(/[^a-zA-ZÀ-ÿ\u00f1\u00d1_]/g, '');
        break;
      case 'letrasyespacios':
        input = input.replace(/[^a-zA-ZÀ-ÿ\u00f1\u00d1\s]/g, '');
        break;
      case 'numeros':
        input = input.replace(/[^0-9]/g, '');
        break;
      case 'letrasynumerosguion':
        input = input.replace(/[^a-zA-Z0-9\u00f1\u00d1\s.,-]/g, '');
        break;
      case 'direccion':
        input = input.replace(/[^a-zA-Z0-9\u00f1\u00d1\s.,#-]/g, '');
        break;
    }
    if (this.formulario?.get(controlName)) {
      this.formulario.get(controlName)?.setValue(input.toUpperCase(), { emitEvent: false });
    }
    if (this.formAsistencia?.get(controlName)) {
      this.formAsistencia.get(controlName)?.setValue(input.toUpperCase(), { emitEvent: false });
    }
  }

  getFormControls(): string[] {
    return Object.keys(this.formulario.controls);
  }

  fadicionar(content: any){
    this.estado = 'Adicionar';
    this.beneficio = new Beneficios();
    this.fdescargar(0, 'Convocatoria');
    this.fdescargar(0, 'Afiche');
    this.fformulario(this.beneficio);
    this.modalRefBeneficio = this._modalService.open(content, {
      backdrop: 'static',
      keyboard: false,
      size: 'lg',
      scrollable: true
    });
  }

  fmodificar(id: number, content: any){
    this.estado = 'Modificar';
    this._beneficiosService.dato(id).subscribe((data) => {
      this.beneficio = data;
      this.fdescargar(data.idbeneficio, 'Convocatoria');
      this.fdescargar(data.idbeneficio, 'Afiche');
      this.fformulario(this.beneficio);
      this.modalRefBeneficio = this._modalService.open(content, {
        backdrop: 'static',
        keyboard: false,
        size: 'lg',
        scrollable: true
      });
    });
  }

  faceptar(){
    this.submitted = true;

    this.beneficio.beneficio = this.formulario.value.beneficio;
    this.beneficio.descripcion = this.formulario.value.descripcion;
    this.beneficio.idtipobeneficio = this.formulario.value.idtipobeneficio;
    this.beneficio.idmunicipio = this.formulario.value.idmunicipio;
    this.beneficio.direccion = this.formulario.value.direccion;
    this.beneficio.fechainicio = this.formulario.value.fechainicio;
    this.beneficio.fechafin = this.formulario.value.fechafin;
    this.beneficio.idcapacitador = this.formulario.value.idcapacitador;
    this.beneficio.capacidad = this.formulario.value.capacidad;

    if (this.estado === 'Modificar') {
      this._beneficiosService.modificar(this.beneficio).subscribe((data) => {
        this.fdatos();
        this.modalRefBeneficio.dismiss();
        Swal.fire('Exito', 'Beneficio modificado correctamente', 'success');
        this._toast.success('','Operación exitosa');
      });
    }else{
      this._beneficiosService.adicionar(this.beneficio).subscribe(data => {
        this.fdatos();
        this.modalRefBeneficio.dismiss();
        Swal.fire('Exito', 'Beneficio adicionado correctamente', 'success');
        this._toast.success('','Operación exitosa');
      });
    }
  }

  fcancelar(){
    this.modalRefBeneficio.dismiss();
    if (this.representantes) {
      this.limpiarRep();
    }
  }

  fcancelarImagen(){
    this.modalRefImagen.dismiss();
    this.archivoSeleccionado = null;
  }

  fconvocatoria(contenido: any) {
    this.estado = 'Convocatoria';
    this.modalRefImagen = this._modalService.open(contenido, {
      backdrop: 'static',
      keyboard: false
    });
  }
  fafiche(contenido: any) {
    this.estado = 'Afiche';
    this.modalRefImagen = this._modalService.open(contenido, {
      backdrop: 'static',
      keyboard: false
    });
  }

  fseleccionarArchivo(event) {
    const archivo = event.target.files[0];
    if (!archivo) {
      return;
    }

    const tamañoMaximoMB = 2;
    const tamañoMaximoBytes = tamañoMaximoMB * 1024 * 1024;
    if (archivo.size > tamañoMaximoBytes) {
      this._toast.error(`El archivo supera el límite de ${tamañoMaximoMB} MB.`, 'Tamaño de archivo no permitido');
      this.fremoverArchivo();
      return;
    }

    const tipoArchivo = archivo.type;
    if (tipoArchivo !== 'image/png' && tipoArchivo !== 'image/jpeg') {
      this._toast.error('Solo se permiten archivos PNG o JPG.', 'Formato no soportado');
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

  fcargar() {
    Swal.fire({
      title: 'Cargando archivo...',
      html: 'Progreso: <b>0%</b>',
      allowOutsideClick: false,
      onBeforeOpen: () => {
        Swal.showLoading();
      }
    });
    if (this.estado === 'Convocatoria') {
      this._beneficiosService.upload(this.beneficio.idbeneficio.toString(), this.estado.toLowerCase(), this.archivoSeleccionado).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          const progreso = Math.round((event.loaded / event.total) * 100);
          Swal.getHtmlContainer().querySelector('b').textContent = `${progreso}%`;
        } else if (event.type === HttpEventType.Response) {
          Swal.close();
          Swal.fire('Archivo cargado', 'Archivo cargado con éxito', 'success');
          this._toast.success('', 'Carnet Anverso cambiado.');
          this.fdescargar(this.beneficio.idbeneficio, this.estado);
          this.archivoSeleccionado = null;
          this.modalRefImagen.dismiss();
        }
      }, error => {
        Swal.close();
        Swal.fire('Error', 'Ocurrió un error durante la subida, por favor contacte al ADMINISTRADOR', 'error');
      });
    }else if (this.estado === 'Afiche') {
      this._beneficiosService.upload(this.beneficio.idbeneficio.toString(), this.estado.toLowerCase(), this.archivoSeleccionado).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          const progreso = Math.round((event.loaded / event.total) * 100);
          Swal.getHtmlContainer().querySelector('b').textContent = `${progreso}%`;
        } else if (event.type === HttpEventType.Response) {
          Swal.close();
          Swal.fire('Archivo cargado', 'Archivo cargado con éxito', 'success');
          this._toast.success('', 'Carnet Reverso cambiado.');
          this.fdescargar(this.beneficio.idbeneficio, this.estado);
          this.archivoSeleccionado = null;
          this.modalRefImagen.dismiss();
        }
      }, error => {
        Swal.close();
        Swal.fire('Error', 'Ocurrió un error durante la subida, por favor contacte al ADMINISTRADOR', 'error');
      });
    }
  }

  fdescargar(id: number, rol: string) {
    if (rol == 'Convocatoria') {
      this.convocatoria = [];
      this._beneficiosService.download(id, rol.toLowerCase()).subscribe((data) => {
        this.convocatoria = data;
      });
    }
    if (rol == 'Afiche') {
      this.afiche = [];
      this._beneficiosService.download(id, rol.toLowerCase()).subscribe((data) => {
        this.afiche = data;
      });
    }
  }

  sanitizarImagen(data: string, mimeType: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(`data:${mimeType};base64,${data}`);
  }

  fbuscarRep() {
    this.paginaRep = 0;
    this.frepresentantes();
  }


  mostrarMasRep(evento: any){
    this.paginaRep = evento;
    this.frepresentantes();
  }

  limpiarRep() {
    this.paginaRep = 0;
    this.buscarRep = '';
    this.frepresentantes();
  }

  fcantidaddatosl(){
    this._representantesService.cantidaddatosl(this.buscarRep).subscribe((data) => {
      this.totalRep = data;
    })
  }

  fcantidadbeneficio(id: number){
    this._beneficiosempresasService.cantidad(id).subscribe((data) => {
      this.cantidadbeneficio = data;
    });
  }

  frepresentantes(){
    this._representantesService.datosl(this.paginaRep, this.cantidadRep, this.buscarRep, this.beneficio.idbeneficio).subscribe((data) => {
      this.representantes = data;
      this.fcantidaddatosl();
    });
  }

  fparticipantes(id: number, content: any){
    this.utilsService.mostrarCargando();
    this.estado = 'Inscripción';
    this._beneficiosService.dato(id).subscribe((data) => {
      this.modalRefBeneficio = this._modalService.open(content, {
        backdrop: 'static',
        keyboard: false,
        size: 'lg'
      });
      this.beneficio = data;
      this.frepresentantes();
      this.fcantidadbeneficio(data.idbeneficio);
      this.utilsService.cerrarCargando();
    });
  }

  festadobeneficio(event: any, idrepresentante: number){
    const checked = event.target.checked;
    const dato: any = {
      idbeneficio: this.beneficio.idbeneficio,
      idrepresentante: idrepresentante,
    };

    if (checked) {
      this._beneficiosempresasService.adicionar(dato).subscribe({
        next: (response) => {
          this.frepresentantes();
          this.fcantidadbeneficio(this.beneficio.idbeneficio);
          this.limpiarRep();
          this._toast.success('Representante agregado al Beneficio', 'Hecho');
        },
        error: (error) => {
          this._toast.error('No se pudo agregar al Representante', 'Error');
        }
      });
    }else{
      this._beneficiosempresasService.eliminar(dato).subscribe({
        next: (response) => {
          this.frepresentantes();
          this.fcantidadbeneficio(this.beneficio.idbeneficio);
          this.limpiarRep();
          this._toast.success('Representante eliminado del beneficio', 'Hecho');
        },
        error: (error) => {
          this._toast.error('No se pudo elimnar al Representante', 'Error');
        }
      });
    }
  }

  fbuscarEmp(id: number) {
    this.paginaEmp = 0;
    this.fbeneficiosempresas(id);
  }


  mostrarMasEmp(evento: any, id: number){
    this.paginaEmp = evento;
    this.fbeneficiosempresas(id);
  }

  limpiarEmp(id: number) {
    this.paginaEmp = 1;
    this.buscarEmp = '';
    this.fbeneficiosempresas(id);
  }

  fcantidadempresas(id: number){
    this._beneficiosempresasService.cantidadbeneficio(this.buscarEmp, id).subscribe((data) => {
      this.totalEmp = data;
    });
  }
  fbeneficiosempresas(id: number){
    this._beneficiosempresasService.datos(this.paginaEmp, this.cantidadEmp, this.buscarEmp, id).subscribe((data) => {
      this.beneficiosempresas = data;
      this.fcantidadempresas(id);
    });
  }

  fver(id: number, content: any){
    this.estado = 'Ver';
    this.limpiarEmp(id);
    this._beneficiosService.dato(id).subscribe((data) => {
      this.beneficio = data;
      this.fdescargar(data.idbeneficio, 'Convocatoria');
      this.fdescargar(data.idbeneficio, 'Afiche');
      this.fcantidadbeneficio(data.idbeneficio);
      this.fbeneficiosempresas(data.idbeneficio);
      if (data.tipobeneficio.tipobeneficio !== 'FERIA') {
        this.fasistencias(data.idbeneficio);
      }
      this.modalRefBeneficio = this._modalService.open(content, {
        backdrop: 'static',
        keyboard: false,
        size: 'lg'
      });
    });
  }

  fbeneficiosasistencias(id: number){
    this._beneficiosempresasService.datosl(id).subscribe((data) => {
      this.beneficiosempresaslista = data;
    });
  }

  ffechasasistencia(id: number){
    this._asistenciasempresasService.fechas(id).subscribe((data) => {
      this.fechasasistencia = data;
    });
  }

  fdatosasistencias(id:number){
    this._asistenciasempresasService.datos(id).subscribe((data) => {
      this.asistenciasempresas = data;
    });
  }

  fasistencias(id: number){
    this._asistenciasService.dato(id).subscribe(
      data => {
      this.asistencia = data;
      },
      error => {
        if (error.status === 404) {
          this.asistencia = null;
        }
      }
    );
  }

  fformAsistencia(asistencia: Asistencias){
    this.formAsistencia = this._fBA.group({
      idbeneficio:[
        asistencia.idbeneficio,
        [
          Validators.required,
        ]
      ],
      dias:[
        asistencia.dias,
        [
          Validators.required,
          Validators.pattern('^[0-9]+$'),
        ]
      ],
      duraciondias:[
        asistencia.duraciondias,
        [
          Validators.required,
          Validators.pattern('^[0-9]+$')
        ]
      ],
      duracioncurso:[
        asistencia.duracioncurso,
        [
          Validators.required,
          Validators.pattern('^[0-9]+$')
        ]
      ],
    });
  }

  get fA() { return this.formAsistencia.controls; }

  calculoDias(fechainicio: string, fechafin: string): number {
    const inicio = new Date(fechainicio);
    const fin = new Date(fechafin);

    let totalDias = 0;

    for (let date = inicio; date <= fin; date.setDate(date.getDate() + 1)) {
      const day = date.getDay();
      if (day >= 1 && day <= 5) {
        totalDias++;
      }
    }

    return totalDias;
  }
  calcularDuracionCurso(){
    const duracionPorDia = this.formAsistencia.get('duraciondias').value;
    const dias = this.asistencia.dias;

    if (duracionPorDia && dias) {
      const duracionCursoTotal = duracionPorDia * dias;
      this.formAsistencia.get('duracioncurso').setValue(duracionCursoTotal);
    }
  }

  fcrearasistencia(id: number, content: any){
    this.estadotipo = 'Crear';
    this.asistencia = new Asistencias();
    this.asistencia.idbeneficio = this.beneficio.idbeneficio;
    const fechainicio = new Date(this.beneficio.fechainicio).toISOString();
    const fechafin = new Date(this.beneficio.fechafin).toISOString();
    this.asistencia.dias = this.calculoDias(fechainicio, fechafin);
    this.fformAsistencia(this.asistencia);
    this.modalRefPlanilla = this._modalService.open(content, {
      backdrop: 'static',
      keyboard: false
    });
  }

  fregasistencia(id: number, content: any){
    this.estadotipo = 'Registrar';
    this._asistenciasService.dato(id).subscribe((data) => {
      this.asistencia = data;
      this.fbeneficiosasistencias(this.beneficio.idbeneficio);
      this.ffechasasistencia(this.asistencia.idasistencia);
      this.fdatosasistencias(this.asistencia.idasistencia);
      this.modalRefPlanilla = this._modalService.open(content, {
        backdrop: 'static',
        keyboard: false,
        size:'lg',
        scrollable: true
      });
    });
  }

  faceptarAsistencia(){
    this.submitted = true;

    this.asistencia.idbeneficio = this.beneficio.idbeneficio;
    this.asistencia.dias = this.formAsistencia.value.dias;
    this.asistencia.duraciondias = this.formAsistencia.value.duraciondias;
    this.asistencia.duracioncurso = this.formAsistencia.value.duracioncurso;

    if (this.estadotipo == 'Modificar') {
      this.asistencia.idasistencia = this.asistencia.idasistencia;
      this._asistenciasService.modificar(this.asistencia).subscribe((data) => {
        this.fasistencias(this.beneficio.idbeneficio);
        this.modalRefPlanilla.dismiss();
        Swal.fire('Exito', 'Asistencia modificada correctamente', 'success');
        this._toast.success('','Operación exitosa');
      });
    }else{
      this._asistenciasService.adicionar(this.asistencia).subscribe((data) => {
        this.fasistencias(this.beneficio.idbeneficio);
        this.modalRefPlanilla.dismiss();
        Swal.fire('Exito', 'Asistencia creada correctamente', 'success');
        this._toast.success('','Operación exitosa');
      })
    }
  }


  fplanillaxls(id: number, tipo: string, content: any){
    if (tipo == 'Registro') {
      this._beneficiosempresasService.planillaXLS(id).subscribe(
        blob => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.setAttribute("style", "display:none;");
          document.body.appendChild(a);
          a.href = url;
          a.download = "Planilla_Registro_Beneficio.xlsx";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
          return url;
        }, error => {
          this._toast.error('Error al descargar el archivo', 'Error');
        });
    }
  }

  fplanilla(id: number, tipo: string, content: any){
    this.estadotipo = tipo;

    if (this.estadotipo == 'Registro') {
      this._beneficiosempresasService.planillaReg(id).subscribe(
        data => {
          const url = window.URL.createObjectURL(data);
          this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
          this.modalRefPlanilla =  this._modalService.open(content, {
            backdrop: 'static',
            keyboard: false,
            size: 'xl'
          });
        },
        error => {
          const mensaje = error.error?.mensaje || 'Error desconocido. Intenta nuevamente.';
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: mensaje,
            confirmButtonText: 'Aceptar'
          });
          this._toast.error('', 'Error desconocido');
        }
      );
    }
    if (this.estadotipo == 'Inscripcion') {
      this._beneficiosempresasService.planillaInsc(id).subscribe(
        data => {
          const url = window.URL.createObjectURL(data);
          this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
          this.modalRefPlanilla =  this._modalService.open(content, {
            backdrop: 'static',
            keyboard: false,
            size: 'xl'
          });
        },
        error => {
          const mensaje = error.error?.mensaje || 'Error desconocido. Intenta nuevamente.';
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: mensaje,
            confirmButtonText: 'Aceptar'
          });
          this._toast.error('', 'Error desconocido');
        }
      );
    }
    if (this.estadotipo == 'Asistencia') {
      this._asistenciasService.dato(id).subscribe(
        (data) => {
          //this.asistencia = data;
        },
        (error) => {
          if (error.status === 404) {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'El beneficio no tiene asistencias generadas, debe generar Asistencia.',
              confirmButtonText: 'Aceptar'
            });
            this._toast.error('Asistencias no encontradas', 'Error');
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Ha ocurrido un error inesperado.',
              confirmButtonText: 'Aceptar'
            });
            this._toast.error('', 'Error desconocido');
          }
        }
      );
    }
    if (this.estadotipo == 'Evaluacion') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'El beneficio no tiene evaluaciones generadas, debe generar Evaluación.',
        confirmButtonText: 'Aceptar'
      });
      this._toast.error('', 'Error desconocido');
      // this._beneficiosempresasService.planillaInsc(id).subscribe(
      //   data => {
      //     const url = window.URL.createObjectURL(data);
      //     this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      //     this.modalRefPlanilla =  this._modalService.open(content, {
      //       backdrop: 'static',
      //       keyboard: false,
      //       size: 'xl'
      //     });
      //   },
      //   error => {
      //     const mensaje = error.error?.mensaje || 'Error desconocido. Intenta nuevamente.';
      //     Swal.fire({
      //       icon: 'error',
      //       title: 'Oops...',
      //       text: mensaje,
      //       confirmButtonText: 'Aceptar'
      //     });
      //     this._toast.error('', 'Error desconocido');
      //   }
      // );
    }
  }

}
