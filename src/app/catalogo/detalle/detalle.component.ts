import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AccesoService } from 'src/app/_aods/acceso.service';
import { CarritosService } from 'src/app/_aods/carritos.service';
import { CatalogosService } from 'src/app/_aods/catalogos.service';
import { PreciosService } from 'src/app/_aods/precios.service';
import { UtilsService } from 'src/app/_aods/utils.service';
import { RUTA } from 'src/app/_config/application';
import { Atributos } from 'src/app/_entidades/atributos';
import { Carritos } from 'src/app/_entidades/carritos';
import { Colores } from 'src/app/_entidades/colores';
import { Empresas } from 'src/app/_entidades/empresas';
import { Materiales } from 'src/app/_entidades/materiales';
import { Precios } from 'src/app/_entidades/precios';
import { Procesar } from 'src/app/_entidades/procesar';
import { Productos } from 'src/app/_entidades/productos';
import { Rubros } from 'src/app/_entidades/rubros';
import { Tamanos } from 'src/app/_entidades/tamanos';
import { Usuarios } from 'src/app/_entidades/usuarios';
import Swal from 'sweetalert2';
import swal from 'sweetalert2';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  // ruta = `${RUTA}/catalogos/descargarproducto/`;
  // rutaempresa = `${RUTA}/catalogos/descargarempresa/`;
  rutaproducto = `${RUTA}/catalogos/descargarimagenproducto/`;

  carritoVisible: boolean = false;

  gestion: number = new Date().getFullYear();
  nombre: string = '';

  estado: string = '';

  id: number;

  dato: Productos;
  carrito: Carritos;
  atributosProducto: Carritos;
  cantidadcarrito: number;
  carritos: Carritos[] = [];
  carritosAgrupados: any = {};
  totalAPagar: number = 0;
  rubros: Rubros[];
  imagenes: any[] = [];

  imagen: any[] = [];
  imagenActual: any; // Imagen que se muestra en grande
  indiceActual: number = 0;
  intervalo: any;
  imagenActualIndex: number = 0;

  precios: Precios[] = [];
  selectedPrecio: number | null = null;

  colores: Colores[] = [];
  selectedColor: number | null = null;
  selectedColorName: string = '';

  materiales: Materiales[] = [];
  selectedMaterial: number | null = null;

  tamanos: Tamanos[] = [];
  selectedTamano: number | null = null;
  cantidadesPorTamano: { [id: number]: number } = {};

  atributos: Atributos[] = [];
  selectedAtributo: number | null = null;

  estalogueado: Boolean = false;

  datosempresa: Empresas;

  cargando: boolean = false;
  error: string = '';

  totalencarrito = 0;
  encarrito = "";

  cantProd: number = 1;

  formulario: FormGroup;
  submitted: boolean = false;

  formulariom: FormGroup;
  submittedm: boolean = false;

  procesar: Procesar;
  usuario: Usuarios;

  localapellidopat: string;
  localapellidomat: string;
  localnombre: string;
  localusuario: string;
  localcelular: number;
  localcorreo: string;

  isShow: boolean;
  topPosToStartShowing = 100;


  constructor(
    private _route: ActivatedRoute,
    private _catalogosService: CatalogosService,
    private _carritosService: CarritosService,
    private _modalService: NgbModal,
    private _fb: FormBuilder,
    private _ruta: Router,
    private sanitizer: DomSanitizer,
    private utilsService: UtilsService,
    private _toast: ToastrService
  ) {
    let idcliente = localStorage.getItem('idcliente');
    if (!idcliente) {
      idcliente = Math.floor((Math.random() * 1000000) + 1).toString();
      localStorage.setItem('idcliente', idcliente);
    }

    let localusuario = localStorage.getItem('localusuario');
    if (!localusuario) {
      this.localapellidopat = '';
      this.localapellidomat = '';
      this.localnombre = '';
      this.localusuario = '';
      this.localcelular = null;
      this.localcorreo = '';
    } else {
      try {
        this.localapellidopat = JSON.parse(localStorage.getItem('localapellidopat') || '""');
        this.localapellidomat = JSON.parse(localStorage.getItem('localapellidomat') || '""');
        this.localnombre = JSON.parse(localStorage.getItem('localnombre') || '""');
        this.localusuario = JSON.parse(localStorage.getItem('localusuario') || '""');
        this.localcelular = JSON.parse(localStorage.getItem('localcelular') || 'null');
        this.localcorreo = JSON.parse(localStorage.getItem('localcorreo') || '""');
      } catch (error) {
        console.error('Error parsing localStorage data:', error);
        this.localapellidopat = '';
        this.localapellidomat = '';
        this.localnombre = '';
        this.localusuario = '';
        this.localcelular = null;
        this.localcorreo = '';
      }
    }
  }

  ngOnInit(): void {
    this.id = this.utilsService.descifrarId(this._route.snapshot.params['id']);
    this.cargando = true;
    this.error = '';
    this.fdato(this.id);
    this.fcantidadcarrito();
    this.imagenActual = this.imagenes[0];
    this.fdescargar(this.id);
    //console.log(this.localusuario);

  }

  @HostListener('window:scroll')
  checkScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (scrollPosition >= this.topPosToStartShowing) {
      this.isShow = true;
    } else {
      this.isShow = false;
    }
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleCarrito() {
    const body = document.body;
    const isOffcanvasOpen = body.classList.contains('offcanvas-open');

    if (isOffcanvasOpen) {
      body.classList.remove('offcanvas-open');
    } else {
      body.classList.add('offcanvas-open');
    }
    this.carritoVisible = !this.carritoVisible;
    this.fdatoscarrito();
  }

  fdatoscarrito(){
    let idcliente = JSON.parse(localStorage.getItem('idcliente'));
    this._carritosService.datosl(idcliente).subscribe((data: Carritos[]) => {
      this.carritos = data;
      this.totalAPagar = this.carritos.reduce((total, carrito) => total + carrito.cantidad * carrito.precio?.precio, 0);
      this.agruparPorEmpresa();
    });
  }

  agruparPorEmpresa(): void {
    this.carritosAgrupados = this.carritos.reduce((agrupado: { [empresa: string]: Carritos[] }, carrito) => {
      const empresaNombre = carrito.producto.empresa.empresa;
      if (!agrupado[empresaNombre]) {
        agrupado[empresaNombre] = [];
      }
      agrupado[empresaNombre].push(carrito);
      return agrupado;
    }, {});
  }


  fcantidadcarrito() {
    let idcliente = JSON.parse(localStorage.getItem('idcliente'));
    this._carritosService.cantidadcarrito(idcliente).subscribe(data => {
      this.cantidadcarrito = data;
    });
  }

  fprecios(id: number){
    this._catalogosService.precios(id).subscribe((data) => {
      this.precios = data;
    });
  }

  selectPrecio(idprecio: number): void {
    this.selectedPrecio = idprecio;
    //console.log(this.selectedPrecio);

  }

  fcolores(id: number){
    this._catalogosService.colores(id).subscribe((data) => {
      this.colores = data;
    });
  }

  selectColor(idcolor: number): void {
    this.selectedColor = idcolor;

    const colorSeleccionado = this.colores.find(color => color.idcolor === idcolor);
    if (colorSeleccionado) {
      this.selectedColorName = colorSeleccionado.color;
    }

    //console.log(this.selectedColor, this.selectedColorName);
  }

  fmateriales(id: number){
    this._catalogosService.materiales(id).subscribe((data) => {
      this.materiales = data;
    });
  }

  selectMaterial(idmaterial: number): void {
    this.selectedMaterial = idmaterial;
    //console.log(this.selectedMaterial);
  }

  ftamanos(id: number){
    this._catalogosService.tamanos(id).subscribe((data) => {
      this.tamanos = data;
    });
  }

  selectTamano(idtamano: number): void {
    this.selectedTamano = idtamano;
    if (!(idtamano in this.cantidadesPorTamano)) {
      this.cantidadesPorTamano[idtamano] = 1;
    }
    //console.log(this.selectedTamano + ' ' + this.cantidadesPorTamano[idtamano]);
  }

  fatributos(id: number){
    this._catalogosService.atributos(id).subscribe((data) => {
      this.atributos = data;
    });
  }

  fdato(id: number) {
    this._catalogosService.dato(id).subscribe(
      (data) => {
        this.dato = data;
        this.fdescargar(data.idproducto);
        this.fprecios(data.idproducto);
        this.fcolores(data.idproducto);
        this.fmateriales(data.idproducto);
        this.ftamanos(data.idproducto);
        this.fatributos(data.idproducto);
        this.cargando = false;
      }, (error) => {
        this.cargando = false;
        if (error.status === 0) {
          this.error = `Error de conexión. Verifica tu conexión a internet.`;
        } else if (error.status >= 400 && error.status < 500) {
          this.error = `Error en la solicitud. Por favor revisa los parámetros enviados.`;
        } else if (error.status >= 500) {
          this.error = `Error en el servidor. Inténtalo de nuevo más tarde.`;
        } else {
          this.error = `Error inesperado. Inténtalo de nuevo más tarde.`;
        }
      }
    );
  }

  fdescargar(id: number) {
    this.imagenes = [];
    this._catalogosService.download(id, 'productos').subscribe((data) => {
      this.imagenes = data.map((img) => ({
        data: this.sanitizarImagen(img.data, img.mimeType),
        mimeType: img.mimeType,
        filename: img.filename
      }));

      if (this.imagenes.length > 0) {
        this.imagenActual = this.imagenes[0];
        this.iniciarDesplazamientoAutomatico();
      }
    });
  }

  sanitizarImagen(data: string, mimeType: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(`data:${mimeType};base64,${data}`);
  }

  iniciarDesplazamientoAutomatico() {
    // this.intervalo = setInterval(() => {
    //   this.cambiarImagenAutomatica();
    // }, 3000); // Cambia cada 3 segundos
  }

  cambiarImagenAutomatica() {
    if (this.imagenes.length > 0) {
      this.indiceActual = (this.indiceActual + 1) % this.imagenes.length;
      this.imagenActual = this.imagenes[this.indiceActual];
    }
  }

  cambiarImagen(imagen: any) {
    this.imagenActual = imagen;
  }

  mostrarImagen(indice: number) {
    clearInterval(this.intervalo);
    this.imagenActual = this.imagenes[indice];
    //console.log(this.imagenActual.filename);

  }

  ngOnDestroy() {
    clearInterval(this.intervalo);
  }

  desplazarIzquierda() {
    if (this.imagenes.length > 0) {
      this.imagenActualIndex = (this.imagenActualIndex - 1 + this.imagenes.length) % this.imagenes.length;
      this.imagenActual = this.imagenes[this.imagenActualIndex];
      //console.log(this.imagenActual.filename);
    }
  }

  desplazarDerecha() {
    if (this.imagenes.length > 0) {
      this.imagenActualIndex = (this.imagenActualIndex + 1) % this.imagenes.length;
      this.imagenActual = this.imagenes[this.imagenActualIndex];
      //console.log(this.imagenActual.filename);
    }
  }

  fmas(idtamano: number): void {
    if (idtamano === this.selectedTamano) {
      this.cantidadesPorTamano[idtamano] = (this.cantidadesPorTamano[idtamano] || 1) + 1;
      //console.log(this.selectedTamano + ' ' + this.cantidadesPorTamano[idtamano]);
      this.cantProd = this.cantidadesPorTamano[idtamano];
    }
  }

  onInput(event: any, idtamano: number ): void {
    let input = event.target.value.replace(/[^0-9]/g, '');

    if (idtamano === this.selectedTamano) {
      this.cantidadesPorTamano[idtamano] = input ? parseInt(input, 10) : 0;
      //console.log(this.selectedTamano + ' ' + this.cantidadesPorTamano[idtamano]);
      this.cantProd = this.cantidadesPorTamano[idtamano];
    }
    event.target.value = this.cantidadesPorTamano[idtamano];
  }

  fmenos(idtamano: number): void {
    if (idtamano === this.selectedTamano) {
      this.cantidadesPorTamano[idtamano] = Math.max((this.cantidadesPorTamano[idtamano] || 1) - 1, 0);
      //console.log(this.selectedTamano + ' ' + this.cantidadesPorTamano[idtamano]);
      this.cantProd = this.cantidadesPorTamano[idtamano];
    }
  }

  fadicionar(idproducto: number) {
    let idcliente = JSON.parse(localStorage.getItem('idcliente'));
    let nuevoproducto = new Carritos();
    nuevoproducto.idcliente = idcliente;
    nuevoproducto.idproducto = idproducto;
    nuevoproducto.imagen = this.imagenActual.filename;
    nuevoproducto.idprecio = this.selectedPrecio;
    nuevoproducto.idcolor = this.selectedColor;
    nuevoproducto.idmaterial = this.selectedMaterial;
    nuevoproducto.idtamano = this.selectedTamano;
    nuevoproducto.cantidad = this.cantProd;

    //console.log(nuevoproducto);

    Swal.fire({
      title: '¿Estás seguro?',
      text: "¿Quieres agregar este producto al carrito?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, agregar',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'btn btn-success rounded-pill mr-3',
        cancelButton: 'btn btn-secondary rounded-pill',
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.utilsService.mostrarCargando();
        this._carritosService.adicionar(nuevoproducto).subscribe(
          data => {
            this.fcantidadcarrito();
            this._toast.success('El producto ha sido agregado a su carrito.','Agregado');
            this.utilsService.cerrarCargando();
          },
          error => {
            this._toast.error('Ha ocurrido un error, no se pudo agregar a su carrito.','Error')
          }
        );
      }
    });
  }

  feliminar(id: number) {
    this._carritosService.eliminar(id).subscribe(data => {
      this.fdatoscarrito();
      this.fcantidadcarrito();
      this._toast.success('El producto ha sido borrado de su carrito.','Producto eliminado')
    });
  }

  // fsolicitar(content: any) {
  //   let idcliente = JSON.parse(localStorage.getItem('idcliente'));
  //   this._carritosService.datosl(idcliente).subscribe(data => {
  //     this.carritos = data;
  //     this._modalService.open(content, { size: 'lg' });
  //   });
  // };

  // fsolicitarproductoinit() {
  //   let idcliente = JSON.parse(localStorage.getItem('idcliente'));
  //   this._carritosService.datosl(idcliente).subscribe(data => {
  //     this.carritos = data;
  //   });
  // };

  // fsolicitarproducto(content: any) {
  //   let idcliente = JSON.parse(localStorage.getItem('idcliente'));
  //   this._carritosService.datosl(idcliente).subscribe(data => {
  //     this.carritos = data;
  //     this._modalService.open(content);
  //   });
  // };

  // fwhastapp(celular: string) {
  //   const ruta = 'https://api.whatsapp.com/send?phone=591' + celular + '"&text=Hola Me gustaria comunicarme contigo';
  //   window.open(ruta, '_blank');
  // }

  // fempresa(empresa: Empresas, content: any) {
  //   this.datosempresa = empresa;
  //   this._modalService.open(content);
  // }

  fregistrar(content: any){
    this._modalService.dismissAll();
    this.estado = 'Registrar';
    let dato = new Procesar();
    this.fformulario(dato);
    this._modalService.open(content, {
      backdrop: 'static',
      keyboard: false,
      size: 'lg',
      scrollable: true
    });
  }

  verificarUsuario(contenido: any) {
    if (!this.localusuario) {
      this.faccesom(contenido);
    } else {
      this.fprocesa();
    }
  }

  fprocesa() {
    this.estado = 'Procesar';
    if (this.localusuario) {
      let dato = new Procesar();
      dato.primerapellido = this.localapellidopat;
      dato.segundoapellido = this.localapellidomat;
      dato.primernombre = this.localnombre;
      dato.usuario = this.localusuario;
      dato.celular = this.localcelular;
      dato.correo = this.localcorreo;
      this.fformulario(dato);
      this.faceptar();
    }
  }

  fformulario(dato: Procesar) {
    this.formulario = this._fb.group({
      primerapellido: [
        dato.primerapellido,
        [
          Validators.required,
          Validators.pattern('^[a-zA-ZÀ-ÿ\u00f1\u00d1\\s]+$')
        ]
      ],
      segundoapellido: [
        dato.segundoapellido,
        [
          Validators.pattern('^[a-zA-ZÀ-ÿ\u00f1\u00d1\\s]+$')
        ]
      ],
      primernombre: [
        dato.primernombre,
        [
          Validators.required,
          Validators.pattern('^[a-zA-ZÀ-ÿ\u00f1\u00d1\\s]+$')
        ]
      ],
      celular: [
        dato.celular,
        [
          Validators.required,
          Validators.pattern('^[0-9]+$'),
          Validators.maxLength(15)
        ]
      ],
      direccion: [
        dato.direccion,
        [
          Validators.pattern('^[a-zA-Z0-9\u00f1\u00d1\\s.,#-]+$'),
          Validators.maxLength(255)
        ]
      ],
      correo: [
        dato.correo,
        [
          Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'),
          Validators.maxLength(255)
        ]
      ],
      usuario: [
        dato.usuario,
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9\u00f1\u00d1]+$'),
          Validators.maxLength(10)
        ]
      ],
      clave: [
        dato.clave,
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9\u00f1\u00d1]+$'),
          Validators.minLength(8),
          Validators.maxLength(20)
        ]
      ]
    });
  }

  get f() {
    return this.formulario.controls;
  }

  onInputRegister(event: any, controlName: string, type: 'letrasyespacios' | 'numeros' | 'direccion'): void {
    let input = event.target.value;
    switch (type) {
      case 'letrasyespacios':
        input = input.replace(/[^a-zA-ZÀ-ÿ\u00f1\u00d1\s]/g, '');
        break;
      case 'numeros':
        input = input.replace(/[^0-9]/g, '');
        break;
      case 'direccion':
        input = input.replace(/[^a-zA-Z0-9\u00f1\u00d1\s.,#-]/g, '');
        break;
    }
    this.formulario.get(controlName)?.setValue(input.toUpperCase(), { emitEvent: false });
  }

  faceptar() {
    this.submitted = true;

    let idcliente = JSON.parse(localStorage.getItem('idcliente'));
    this.procesar = new Procesar();

    this.procesar.idcliente = idcliente;
    this.procesar.primerapellido = this.formulario.value.primerapellido;
    this.procesar.segundoapellido = this.formulario.value.segundoapellido;
    this.procesar.primernombre = this.formulario.value.primernombre;
    this.procesar.celular = this.formulario.value.celular;
    this.procesar.direccion = this.formulario.value.direccion;
    this.procesar.correo = this.formulario.value.correo;
    this.procesar.usuario = this.formulario.value.usuario;

    if (this.estado == 'Procesar') {
      this.utilsService.mostrarCargando();
      this.procesar.clave = this.formulario.value.clave;

      this._catalogosService.procesar(this.procesar).subscribe(data => {
        this.localapellidopat = this.procesar.primerapellido;
        this.localapellidomat = this.procesar.segundoapellido;
        this.localnombre = this.procesar.primernombre;
        this.localusuario = this.procesar.usuario;
        this.localcelular = this.procesar.celular;
        this.localcorreo = this.procesar.correo;

        localStorage.setItem('localapellidopat', JSON.stringify(this.localapellidopat));
        localStorage.setItem('localapellidomat', JSON.stringify(this.localapellidomat));
        localStorage.setItem('localnombre', JSON.stringify(this.localnombre));
        localStorage.setItem('localusuario', JSON.stringify(this.localusuario));
        localStorage.setItem('localcelular', JSON.stringify(this.localcelular));
        localStorage.setItem('localcorreo', JSON.stringify(this.localcorreo));

        let idcliente = Math.floor((Math.random() * 1000000) + 1);
        localStorage.setItem('idcliente', JSON.stringify(idcliente));
        this.utilsService.cerrarCargando();
        swal.fire('Proceso completado', 'La Unidad productora se comunicara con usted ya se mediante whastapp o su correo electrónico, gracias.', 'success');
        this.fdatoscarrito();
        this.fcantidadcarrito();
        this._modalService.dismissAll();
      });
    }else{
      this._catalogosService.registrarCliente(this.procesar).subscribe((data) => {
        this.localapellidopat = this.procesar.primerapellido;
        this.localapellidomat = this.procesar.segundoapellido;
        this.localnombre = this.procesar.primernombre;
        this.localusuario = this.procesar.usuario;
        this.localcelular = this.procesar.celular;
        this.localcorreo = this.procesar.correo;

        localStorage.setItem('localapellidopat', JSON.stringify(this.localapellidopat));
        localStorage.setItem('localapellidomat', JSON.stringify(this.localapellidomat));
        localStorage.setItem('localnombre', JSON.stringify(this.localnombre));
        localStorage.setItem('localusuario', JSON.stringify(this.localusuario));
        localStorage.setItem('localcelular', JSON.stringify(this.localcelular));
        localStorage.setItem('localcorreo', JSON.stringify(this.localcorreo));

        this._modalService.dismissAll();
        this._toast.success('','REGISTRO COMPLETADO');
        swal.fire('Registro completado', 'Bienvenido a la Tienda Virtual de REACTIVA TIC.', 'success');
        this._modalService.dismissAll();
      })
    }
  }

  fcancelar() {
    this._modalService.dismissAll();
  }

  fsalir() {
    this.localapellidopat = '';
    this.localapellidomat = '';
    this.localnombre = '';
    this.localusuario = '';
    this.localcelular = null;
    this.localcorreo = '';

    const idcliente = Math.floor((Math.random() * 1000000) + 1).toString();
    localStorage.setItem('idcliente', idcliente);

    localStorage.removeItem('localapellidopat');
    localStorage.removeItem('localapellidomat');
    localStorage.removeItem('localnombre');
    localStorage.removeItem('localusuario');
    localStorage.removeItem('localcelular');
    localStorage.removeItem('localcorreo');

    swal.fire('Saliendo del sistema', 'Gracias por utilizar la plataforma', 'success');
    this._toast.success('','SESION FINALIZADA');
  }

  faccesom(contenido: any){
    this.procesar = new Procesar();
    this.fformulariom();
    this._modalService.open(contenido, {
      // backdrop: 'static',
      // keyboard: false,
      size: 'sm',
      centered: true
    });
  }

  fformulariom() {
    this.formulariom = this._fb.group({
      usuario: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-zA-Z0-9]*'),
          Validators.maxLength(10)
        ]
      ],
      clave: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20)
        ]
      ],
    });
  }

  get fm() {
    return this.formulariom.controls;
  }

  onInputLogin(event: any, controlName: string, type: 'usuario' | 'clave' ): void {
    let input = event.target.value;
    switch (type) {
      case 'usuario':
        input = input.replace(/[^a-zA-ZÀ-ÿ0-9\u00f1\u00d1]/g, '');
        break;
      case 'clave':
        input = input.replace(/['"= ]/g, '');
        break;
    }
    this.formulariom.get(controlName)?.setValue(input, { emitEvent: false });
  }

  faceptarm(){
    this.submittedm = true;

    this.procesar.usuario = this.formulariom.value.usuario;
    this.procesar.clave = this.formulariom.value.clave;

    this._catalogosService.usuariocatalogo(this.procesar).subscribe(
      data => {
        if (data) {
          this.localapellidopat = data.primerapellido;
          this.localapellidomat = data.segundoapellido;
          this.localnombre = data.primernombre;
          this.localusuario = data.usuario
          this.localcelular = data.celular;
          this.localcorreo = data.correo;

          localStorage.setItem('localapellidopat', JSON.stringify(this.localapellidopat));
          localStorage.setItem('localapellidomat', JSON.stringify(this.localapellidomat));
          localStorage.setItem('localnombre', JSON.stringify(this.localnombre));
          localStorage.setItem('localusuario', JSON.stringify(this.localusuario));
          localStorage.setItem('localcelular', JSON.stringify(this.localcelular));
          localStorage.setItem('localcorreo', JSON.stringify(this.localcorreo));

          this._modalService.dismissAll();
          this._toast.success('','SESION INICIADA');
        } else {
          swal.fire('Verifica tus datos!', 'Tu usuario o clave de acceso son incorrectos', 'warning');
        }
      },
      error => {
        if (error.status === 400) {
          swal.fire('Error en la solicitud', 'Los datos enviados no son válidos. Verifica tu entrada y vuelve a intentarlo.', 'error');
        } else if (error.status === 401) {
          swal.fire('Error de autenticación', 'Usuario no encontrado. Verifica tus datos y vuelve a intentarlo.', 'error');
        } else if (error.status === 404) {
          swal.fire('Error de autenticación', 'Usuario o contraseña incorrectos. Verifica tu entrada y vuelve a intentarlo.', 'error');
        } else if (error.status === 500) {
          swal.fire('Error del servidor', 'Ocurrió un problema en el servidor. Inténtalo más tarde.', 'error');
        } else {
          swal.fire('Error', 'Ocurrió un error inesperado. Por favor, intenta nuevamente.', 'error');
        }
      }
    );
  }

  finicio(){
    const _ruta = '/catalogo';
    this._ruta.navigateByUrl(_ruta);
  }

  forgotPassword(){

  }
}
