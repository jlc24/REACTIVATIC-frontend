import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ProductosService } from 'src/app/_aods/productos.service';
import { Productos } from 'src/app/_entidades/productos';
import swal from 'sweetalert2';
import { RUTA } from 'src/app/_config/application';
import { AccesoService } from 'src/app/_aods/acceso.service';
import { Precios } from 'src/app/_entidades/precios';
import { ToastrService } from 'ngx-toastr';
import { PreciosService } from 'src/app/_aods/precios.service';
import { Colores } from 'src/app/_entidades/colores';
import { ColoresService } from 'src/app/_aods/colores.service';
import { Materiales } from 'src/app/_entidades/materiales';
import { MaterialesService } from 'src/app/_aods/materiales.service';
import { Tamanos } from 'src/app/_entidades/tamanos';
import { TamanosService } from 'src/app/_aods/tamanos.service';
import { Atributos } from 'src/app/_entidades/atributos';
import { AtributosService } from 'src/app/_aods/atributos.service';
import { Empresas } from 'src/app/_entidades/empresas';
import { EmpresasService } from 'src/app/_aods/empresas.service';
import { UtilsService } from 'src/app/_aods/utils.service';
import { HttpEventType } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {

  ruta = `${RUTA}/catalogos/descargarproducto/`;

  archivoseleccionado: File;

  datos: Productos[];
  dato: Productos;
  empresas: Empresas[];

  precios: Precios[];
  precio: Precios;
  colores: Colores[];
  color: Colores;
  materiales: Materiales[];
  material: Materiales;
  showTamano = false;
  showMaterial = false;
  tamanos: Tamanos[];
  tamano: Tamanos;
  atributos: Atributos[];
  atributo: Atributos;
  imagenes: any[];
  imagen: any;

  pagina: number = 1;
  numPaginas: number = 0;
  cantidad: number = 10;
  buscar: string = '';
  rubro: string = '';
  total: number = 0;
  estado: string = '';

  formulario: FormGroup;
  formPrecio: FormGroup;
  formColor: FormGroup;
  formMaterial: FormGroup;
  formTamano: FormGroup;
  formAtributo: FormGroup;
  submitted: boolean = false;

  //imagen: any;

  caracteresMaximos: number = 255;
  caracteresRestantes: number = this.caracteresMaximos;

  imageSrc: string;

  esadmin: boolean = false;
  essddpi: boolean = false;
  esdpeic: boolean = false;
  esreactivatic: boolean = false;
  esRolEmpresa: boolean = false;

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

  modalRefProducto: NgbModalRef;
  modalRefDetalle: NgbModalRef;

  @ViewChild('archivoInput') archivoInput: ElementRef;
  archivoSeleccionado: File = null;
  miniaturaUrl: string | ArrayBuffer = null;
  sizeFileFormat: string | null = null;
  cargando: boolean = false;
  progreso: number = 0;

  colors = [
    { name: 'Negro', code: '#000000' },
    { name: 'Burdeos', code: '#800000' },
    { name: 'Marrón', code: '#A52A2A' },
    { name: 'Ladrillo', code: '#B22222' },
    { name: 'Chocolate', code: '#D2691E' },
    { name: 'Cobre', code: '#B87333' },
    { name: 'Caramelo', code: '#AF6E4D' },
    { name: 'Terracota', code: '#E2725B' },
    { name: 'Vino', code: '#722F37' },
    { name: 'Naranja', code: '#FFA500' },
    { name: 'Rojo', code: '#FF0000' },
    { name: 'Rojo Carmesí', code: '#D50032' },
    { name: 'Salmón', code: '#FA8072' },
    { name: 'Tomate', code: '#FF6347' },
    { name: 'Coral', code: '#FF7F50' },
    { name: 'Arena', code: '#C2B280' },
    { name: 'Mostaza', code: '#FFDB58' },
    { name: 'Oro viejo', code: '#CFB53B' },
    { name: 'Verde militar', code: '#4B5320' },
    { name: 'Verde bosque', code: '#228B22' },
    { name: 'Oliva', code: '#808000' },
    { name: 'Verde', code: '#008000' },
    { name: 'Lima', code: '#00FF00' },
    { name: 'Menta', code: '#98FF98' },
    { name: 'Menta verde', code: '#98FF98' },
    { name: 'Esmeralda', code: '#50C878' },
    { name: 'Turquesa', code: '#40E0D0' },
    { name: 'Aguamarina', code: '#7FFFD4' },
    { name: 'Cian', code: '#00FFFF' },
    { name: 'Perla', code: '#EAE0C8' },
    { name: 'Champán', code: '#F7E7CE' },
    { name: 'Crema', code: '#FFFDD0' },
    { name: 'Lavanda', code: '#E6E6FA' },
    { name: 'Pizarra', code: '#708090' },
    { name: 'Azul marino', code: '#000080' },
    { name: 'Azul', code: '#0000FF' },
    { name: 'Zafiro', code: '#0F52BA' },
    { name: 'Índigo', code: '#4B0082' },
    { name: 'Púrpura', code: '#800080' },
    { name: 'Violeta', code: '#EE82EE' },
    { name: 'Fucsia', code: '#FF0080' },
    { name: 'Magenta', code: '#FF00FF' },
    { name: 'Palo de Rosa', code: '#d2a4a4' },
    { name: 'Rosa', code: '#FFC0CB' },
    { name: 'Rosa claro', code: '#FFB6C1' },
    { name: 'Gris', code: '#808080' },
    { name: 'Gris oscuro', code: '#4F4F4F' },
    { name: 'Plateado', code: '#C0C0C0' },
    { name: 'Blanco', code: '#FFFFFF' },
    { name: 'Marfil', code: '#FFFFF0' },
    { name: 'Melocotón', code: '#FFDAB9' },
    { name: 'Dorado', code: '#FFD700' },
    { name: 'Caqui', code: '#F0E68C' },
    { name: 'Amarillo', code: '#FFFF00' },
  ];

  selectedColor = {
    name: 'Selecciona un color',
    code: '#FFFFFF'
  };

  constructor(
    private _productosService: ProductosService,
    private _empresasServcie: EmpresasService,
    private _preciosService: PreciosService,
    private _coloresService: ColoresService,
    private _materialesService: MaterialesService,
    private _tamanosService: TamanosService,
    private _atributosService: AtributosService,
    private _accesoService: AccesoService,
    private _fb: FormBuilder,
    private _fbP: FormBuilder,
    private _fbM: FormBuilder,
    private _fbT: FormBuilder,
    private _fbA: FormBuilder,
    private _modalService: NgbModal,
    private _toast: ToastrService,
    private sanitizer: DomSanitizer,
    private utilsService: UtilsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.fdatos();
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
    this.esCargoPasante = this._accesoService.esCargoPasante();
    this.esRolEmpresa = this._accesoService.esRolEmpresa();
  }

  onColorClick(colorCode: string) {
    this.selectedColor = this.colors.find(color => color.code === colorCode) || null;
  }

  fcantidad() {
    this._productosService.cantidad(this.buscar).subscribe((data) => {
      this.total = data;
    });
  }

  fcantidadAdmin() {
    this._productosService.cantidadAdmin(this.buscar, this.rubro).subscribe((data) => {
      this.total = data;
    });
  }

  fbuscar() {
    this.pagina = 0;
    this.fdatos();
  }

  fdatos() {
    this.utilsService.mostrarCargando();
    this.esadmin = this._accesoService.esRolAdmin();
    this.essddpi = this._accesoService.esRolSddpi();
    this.esdpeic = this._accesoService.esRolDpeic();
    this.esreactivatic = this._accesoService.esRolReactivatic();

    this.esCargoTextil = this._accesoService.esCargoTextil();
    this.esCargoArtesania = this._accesoService.esCargoArtesania();
    this.esCargoAlimento = this._accesoService.esCargoAlimentos();
    if (this.esadmin || this.essddpi || this.esdpeic || this.esreactivatic) {
      if (this.esCargoTextil) {
        this.rubro = 'TEXTIL';
      }else if (this.esCargoArtesania) {
        this.rubro = 'ARTESANIA';
      }else if(this.esCargoAlimento){
        this.rubro = 'ALIMENTOS';
      }else{
        this.rubro = ''
      }
      this._productosService.datosAdmin(this.pagina, this.cantidad, this.buscar, this.rubro).subscribe(
        (data) => {
          this.fcantidadAdmin();
          this.datos = data;
          this.utilsService.cerrarCargando();
        },
        (error) => {
          swal.fire('Error', error, 'error');
          this._toast.error('Error en la carga de datos', 'Error');
          this.utilsService.cerrarCargando();
          this.router.navigate(['/acceso']);
        }
      )
    }else{
      this._productosService.datos(this.pagina, this.cantidad, this.buscar).subscribe(
        (data) => {
          this.fcantidad();
          this.datos = data;
          this.utilsService.cerrarCargando();
        },
        (error) => {
          swal.fire('Error', error, 'error');
          this._toast.error('Error en la carga de datos', 'Error');
          this.utilsService.cerrarCargando();
          this.router.navigate(['/acceso']);
        }
      );
    }
  }

  fempresas(){
    this._empresasServcie.lista().subscribe((data) => {
      this.empresas = data;
    })
  }

  fprecios(id: number){
    this._preciosService.lista(id).subscribe((data) => {
      this.precios = data;
    });
  }

  fcolores(id: number){
    this._coloresService.lista(id).subscribe((data) => {
      this.colores = data;
    });
  }

  fmateriales(id: number){
    this._materialesService.lista(id).subscribe((data) => {
      this.materiales = data;
    });
  }

  ftamanos(id: number){
    this._tamanosService.lista(id).subscribe((data) => {
      this.tamanos = data;
    });
  }

  fatributos(id: number){
    this._atributosService.lista(id).subscribe((data) => {
      this.atributos = data;
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

  fformulario(dato: Productos) {
    this.formulario = this._fb.group({
      idempresa: [
        dato.idempresa
      ],
      producto: [
        dato.producto,
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z.,\u00f1\u00d1\\s]+$'),
          Validators.maxLength(50)
        ]
      ],
      descripcion: [
        dato.descripcion,
        [
          Validators.required,
        ]
      ]
    });
    this.formulario.get('descripcion').valueChanges.subscribe(value => {
      this.caracteresRestantes = this.caracteresMaximos - (value ? value.length : 0);
    });
  }

  get f() { return this.formulario.controls; }

  onInput(event: any, controlName: string, type: 'letras' | 'letrasyespacios' | 'numeros' | 'letrasynumerosguion'): void {
    let input = event.target.value;
    switch (type) {
      case 'letras':
        input = input.replace(/[^a-zA-ZÀ-ÿ\u00f1\u00d1]/g, '');
        break;
      case 'letrasyespacios':
        input = input.replace(/[^a-zA-ZÀ-ÿ.,\u00f1\u00d1\s]/g, '');
        break;
      case 'numeros':
        input = input.replace(/[^0-9]/g, '');
        break;
      case 'letrasynumerosguion':
        input = input.replace(/[^a-zA-Z0-9.,\u00f1\u00d1\s]/g, '');
        break;
    }
    this.formulario.get(controlName)?.setValue(input.toUpperCase(), { emitEvent: false });
  }

  fadicionar(content: any) {
    this.estado = 'Adicionar';
    this.fempresas();
    this.dato = new Productos();
    this.fformulario(this.dato);
    this.modalRefProducto = this._modalService.open(content, {
      backdrop: 'static',
      keyboard: true
    });
  }

  fmodificar(id: number, content: any) {
    this.estado = 'Modificar';
    this.fempresas();
    this._productosService.dato(id).subscribe((data) => {
      this.imageSrc = null;
      this.dato = data;
      this.fformulario(this.dato);
      /* this.fdescargar(this.dato.idproducto); */
      this.modalRefProducto = this._modalService.open(content, {
        backdrop: 'static',
        keyboard: false
      });
    });
  }

  fver(id: number, content: any){
    this.estado = 'Ver';
    this._productosService.dato(id).subscribe((data) => {
      this.dato = data;
      this.fprecios(data.idproducto);
      this.fcolores(data.idproducto);
      this.fmateriales(data.idproducto);
      this.ftamanos(data.idproducto);
      this.fatributos(data.idproducto);
      this.fdescargar(data.idproducto);
      this.modalRefProducto = this._modalService.open(content, {
        backdrop: 'static',
        keyboard: false,
        size: 'lg',
        scrollable: true
      });
    })
  }

  faceptar(): void {
    this.submitted = true;

    if (!this.esRolEmpresa) {
      this.dato.idempresa = this.formulario.value.idempresa;
    }
    this.dato.producto = this.formulario.value.producto.toUpperCase();
    this.dato.descripcion = this.formulario.value.descripcion;
    this.dato.precioventa = this.formulario.value.precioventa;

    if (this.estado === 'Modificar') {
      this.dato.idproducto = this.dato.idproducto;

      this._productosService.modificar(this.dato).subscribe(
        (data) => {
          this.fdatos();
          this.modalRefProducto.dismiss();
          swal.fire('Dato modificado', 'Dato modificado con exito', 'success');
          this._toast.success('', 'Operación exitosa');
        },
        (error) => {
          swal.fire('Error de modificación', 'Hubo un problema al intentar modificar el dato. Por favor, intenta nuevamente.', 'error');
          this._toast.error('', 'Error de operación');
        }
      );
    } else {
      this._productosService.adicionar(this.dato).subscribe(
        (data) => {
          this.dato = data;
          this.fdatos();
          this.modalRefProducto.dismiss();
          swal.fire('Dato adicionado', 'Dato modificado con exito', 'success');
          this._toast.success('', 'Operación exitosa')
        },
        (error) => {
          swal.fire('Error de registro', 'Hubo un problema al intentar registrar el dato. Por favor, intenta nuevamente.', 'error');
          this._toast.error('', 'Error de operación');
        }
      );
    }
  }

  fcambiarestado(idproducto: number, estado: boolean){
    swal.fire({
      title: !estado ? '¿Está seguro de deshabilitar?' : '¿Está seguro de habilitar?',
      icon: 'warning',
      text: !estado ? 'El producto NO se podrá utilizar para ventas.' : 'El producto se podrá utilizar para ventas.',
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
        this._productosService.cambiarestado({ idproducto, estado }).subscribe( response => {
          this.fdatos();
          swal.fire('Cambio realizado', 'El estado del rubro ha sido cambiado con éxito.', 'success');
        });
      }
    });
  }


  fcancelar() {
    this.modalRefProducto.dismiss();
  }
  fcancelarDet() {
    this.modalRefDetalle.dismiss();
  }

  feliminar(id: number){
    swal.fire({
      title: 'Estás seguro?',
      icon: 'warning',
      text: 'No podrás revertir el borrado de esta imagen!',
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
        this._productosService.eliminar(id).subscribe( data => {
          this.fdatos();
          swal.fire('Eliminado', 'Producto eliminado correctamente', 'success');
          this._toast.success('', 'Producto eliminado');
        });
      }
    });
  }

  fformPrecio(precio: Precios){
    this.formPrecio = this._fbP.group({
      cantidad:[
        precio.cantidad,
        [
          Validators.required,
          Validators.pattern('^[><]?\\d+(\\.\\d+)?\\s*(-\\s*\\d+(\\.\\d+)?)?$')
        ]
      ],
      precio:[
        precio.precio,
        [
          Validators.required,
          Validators.pattern('^[0-9]+([.,][0-9]{1,2})?$'),
        ]
      ],
      idtamano:[
        precio.idtamano
      ],
      idmaterial:[
        precio.idtamano
      ],

    });
  }

  get fP() { return this.formPrecio.controls; }

  onInputPrecio(event: any, controlName: string, type: 'cantidad' | 'precio' ): void {
    let input = event.target.value;
    switch (type) {
      case 'cantidad':
        input = input.replace(/[^0-9\s\.\-<>]/g, '');
        input = input.replace(/(?!^)[><]/g, '');
        break;
      case 'precio':
        input = input.replace(/[^0-9.,\s]/g, '');
        input = input.replace(/(\..*)\./g, '$1');
        input = input.replace(/(,.*),/g, '$1');
        break;
    }
    this.formPrecio.get(controlName)?.setValue(input, { emitEvent: false });
  }

  getFormControlsPrecio(): string[] {
    return Object.keys(this.formPrecio.controls);
  }

  onCheckChange(type: string, event: Event) {
    const checkbox = event.target as HTMLInputElement;

    if (type === 'tamano') {
      this.showTamano = checkbox.checked;
      if (this.showTamano) {
        this.ftamanos(this.dato.idproducto);  // Cambia el 1 por el ID que necesites
      }
    }

    if (type === 'material') {
      this.showMaterial = checkbox.checked;
      if (this.showMaterial) {
        this.fmateriales(this.dato.idproducto);  // Cambia el 1 por el ID que necesites
      }
    }
  }

  fadicionarPrecio(content: any){
    this.estado = 'Adicionar';
    this.precio = new Precios();
    this.fformPrecio(this.precio);
    this.modalRefDetalle = this._modalService.open(content, {
      backdrop: 'static',
      keyboard: false
    });
  }

  feliminarPrecio(id: number){
    this._preciosService.eliminar(id).subscribe(
      (data) => {
        this.fprecios(this.dato.idproducto);
        this._toast.success('', 'Operacion exitosa');
      },
      (error) => {
        this._toast.error('', 'Error de operación');
      }
    );
  }

  faceptarPrecio(){
    this.submitted = true;

    this.precio.idproducto = this.dato.idproducto;
    this.precio.precio = this.formPrecio.value.precio;
    this.precio.cantidad = this.formPrecio.value.cantidad;
    this.precio.idtamano = this.formPrecio.value.idtamano;
    this.precio.idmaterial = this.formPrecio.value.idmaterial;

    if (this.estado === 'Adicionar') {
      this._preciosService.adicionar(this.precio).subscribe(
        (data) => {
          this.fprecios(this.dato.idproducto);
          this.modalRefDetalle.dismiss();
          this._toast.success('', 'Operación exitosa');
        },
        (error) => {
          this._toast.error('', 'Error de operación');
        }
      );
    }
  }

  fadicionarColor(content: any){
    this.estado = 'Adicionar';
    this.color = new Colores();
    this.modalRefDetalle = this._modalService.open(content, {
      backdrop: 'static',
      keyboard: false,
      size: 'lg',
      scrollable: true
    });
  }

  feliminarColor(id: number){
    this._coloresService.eliminar(id).subscribe(
      (data) => {
        this.fcolores(this.dato.idproducto);
        this._toast.success('', 'Operacion exitosa');
      },
      (error) => {
        this._toast.error('', 'Error de operación');
      }
    );
  }

  faceptarColor(color: string, codigo: string){

    this.color.idproducto = this.dato.idproducto;
    this.color.color = color;
    this.color.codigo = codigo;

    if (this.estado === 'Adicionar') {
      this._coloresService.adicionar(this.color).subscribe(
        (data) => {
          this.fcolores(this.dato.idproducto);
          this.modalRefDetalle.dismiss();
          this._toast.success('', 'Operación exitosa');
        },
        (error) => {
          this._toast.error('', 'Error de operación');
        }
      );
    }
  }

  fformMaterial(material: Materiales){
    this.formMaterial = this._fbM.group({
      material:[
        material.material,
        [
          Validators.required,
          Validators.pattern('^[a-zA-ZÀ-ÿ0-9\u00f1\u00d1\\s.,%-]+$'),
        ]
      ]
    });
  }

  get fM() { return this.formMaterial.controls; }

  onInputMaterial(event: any, controlName: string, type: 'material' | 'precio' ): void {
    let input = event.target.value;
    switch (type) {
      case 'material':
        input = input.replace(/[^a-zA-ZÀ-ÿ0-9\u00f1\u00d1\s.,%\-]/g, '');
        break;
    }
    this.formMaterial.get(controlName)?.setValue(input.toUpperCase(), { emitEvent: false });
  }

  getFormControlsMaterial(): string[] {
    return Object.keys(this.formMaterial.controls);
  }

  fadicionarMaterial(content: any){
    this.estado = 'Adicionar';
    this.material = new Materiales();
    this.fformMaterial(this.material);
    this.modalRefDetalle = this._modalService.open(content, {
      backdrop: 'static',
      keyboard: false
    });
  }

  feliminarMaterial(id: number){
    this._materialesService.eliminar(id).subscribe(
      (data) => {
        this.fmateriales(this.dato.idproducto);
        this._toast.success('', 'Operacion exitosa');
      },
      (error) => {
        this._toast.error('', 'Error de operación');
      }
    );
  }

  faceptarMaterial(){
    this.submitted = true;

    this.material.idproducto = this.dato.idproducto;
    this.material.material = this.formMaterial.value.material;

    if (this.estado === 'Adicionar') {
      this._materialesService.adicionar(this.material).subscribe(
        (data) => {
          this.fmateriales(this.dato.idproducto);
          this.modalRefDetalle.dismiss();
          this._toast.success('', 'Operacion exitosa');
        },
        (error) => {
          this._toast.error('', 'Error de operación');
        }
      );
    }
  }

  fformTamano(tamano: Tamanos){
    this.formTamano = this._fbT.group({
      tamano:[
        tamano.tamano,
        [
          Validators.required,
          Validators.pattern('^[a-zA-ZÀ-ÿ0-9.,\u00f1\u00d1\\s]+$'),
        ]
      ]
    });
  }

  get fT() { return this.formTamano.controls; }

  onInputTamano(event: any, controlName: string, type: 'tamano' ): void {
    let input = event.target.value;
    switch (type) {
      case 'tamano':
        input = input.replace(/[^a-zA-ZÀ-ÿ0-9.,\u00f1\u00d1\s]/g, '');
        break;
    }
    this.formTamano.get(controlName)?.setValue(input.toUpperCase(), { emitEvent: false });
  }

  getFormControlsTamano(): string[] {
    return Object.keys(this.formTamano.controls);
  }

  fadicionarTamano(content: any){
    this.estado = 'Adicionar';
    this.tamano = new Tamanos();
    this.fformTamano(this.tamano);
    this.modalRefDetalle = this._modalService.open(content, {
      backdrop: 'static',
      keyboard: false
    });
  }

  feliminarTamano(id: number){
    this._tamanosService.eliminar(id).subscribe(
      (data) => {
        this.ftamanos(this.dato.idproducto);
        this._toast.success('', 'Operacion exitosa');
      },
      (error) => {
        this._toast.error('', 'Error de operación');
      }
    );
  }

  faceptarTamano(){
    this.submitted = true;

    this.tamano.idproducto = this.dato.idproducto;
    this.tamano.tamano = this.formTamano.value.tamano;

    if (this.estado === 'Adicionar') {
      this._tamanosService.adicionar(this.tamano).subscribe(
        (data) => {
          this.ftamanos(this.dato.idproducto);
          this.modalRefDetalle.dismiss();
          this._toast.success('', 'Operacion exitosa');
        },
        (error) => {
          this._toast.error('', 'Error de operación');
        }
      );
    }
  }

  fformAtributo(atributo: Atributos){
    this.formAtributo = this._fbA.group({
      atributo:[
        atributo.atributo,
        [
          Validators.required,
          Validators.pattern('^[a-zA-ZÀ-ÿ0-9\u00f1\u00d1\\s]+$'),
        ]
      ],
      detalle: [
        atributo.detalle,
        [
          Validators.required,
          Validators.pattern('^[a-zA-ZÀ-ÿ0-9\u00f1\u00d1\\s.,%-]+$')
        ]
      ]
    });
  }

  get fA() { return this.formAtributo.controls; }

  onInputAtributo(event: any, controlName: string, type: 'atributo' ): void {
    let input = event.target.value;
    switch (type) {
      case 'atributo':
        input = input.replace(/[^a-zA-ZÀ-ÿ0-9\u00f1\u00d1\s.,%\-]/g, '');
        break;
    }
    this.formAtributo.get(controlName)?.setValue(input.toUpperCase(), { emitEvent: false });
  }

  getFormControlsAtributo(): string[] {
    return Object.keys(this.formAtributo.controls);
  }

  fadicionarAtributo(content: any){
    this.estado = 'Adicionar';
    this.atributo = new Atributos();
    this.fformAtributo(this.atributo);
    this.modalRefDetalle = this._modalService.open(content, {
      backdrop: 'static',
      keyboard: false
    });
  }

  feliminarAtributo(id: number){
    this._atributosService.eliminar(id).subscribe(
      (data) => {
        this.fatributos(this.dato.idproducto);
        this._toast.success('', 'Operacion exitosa');
      },
      (error) => {
        this._toast.error('', 'Error de operación');
      }
    );
  }

  faceptarAtributo(){
    this.submitted = true;

    this.atributo.idproducto = this.dato.idproducto;
    this.atributo.atributo = this.formAtributo.value.atributo;
    this.atributo.detalle = this.formAtributo.value.detalle

    if (this.estado === 'Adicionar') {
      this._atributosService.adicionar(this.atributo).subscribe(
        (data) => {
          this.fatributos(this.dato.idproducto);
          this.modalRefDetalle.dismiss();
          this._toast.success('', 'Operacion exitosa');
        },
        (error) => {
          this._toast.error('', 'Error de operación');
        }
      );
    }
  }

  fadicionarImagen(content: any){
    this.estado = 'Adicionar';
    this.atributo = new Atributos();
    this.fformAtributo(this.atributo);
    this.modalRefDetalle = this._modalService.open(content, {
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

    this._productosService.upload(this.dato.idproducto.toString(), 'productos', this.archivoSeleccionado).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        const progreso = Math.round((event.loaded / event.total) * 100);
        swal.getHtmlContainer().querySelector('b').textContent = `${progreso}%`;
      } else if (event.type === HttpEventType.Response) {
        swal.close();
        this._toast.success('','Imagen de producto agregado.');
        this.fdescargar(this.dato.idproducto);
        this.modalRefDetalle.dismiss();
        this.archivoSeleccionado = null;
      }
    });
  }

  fdescargar(id: number) {
    this.imagenes = [];
    this._productosService.download(id, 'productos').subscribe((data) => {
      this.imagenes = data;
    });
  }

  feliminarimagen(id: number, archivo: string, tipo: string){
    this._productosService.eliminarImagenp(id, archivo, tipo).subscribe(data => {
      this.fdescargar(id);
    });
  }

  sanitizarImagen(data: string, mimeType: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(`data:${mimeType};base64,${data}`);
  }

  fseleccionarArchivo(event: any) {
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
}

