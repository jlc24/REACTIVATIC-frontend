import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CarritosService } from 'src/app/_aods/carritos.service';
import { CatalogosService } from 'src/app/_aods/catalogos.service';
import { UtilsService } from 'src/app/_aods/utils.service';
import { RUTA } from 'src/app/_config/application';
import { Carritos } from 'src/app/_entidades/carritos';
import { Empresas } from 'src/app/_entidades/empresas';
import { Procesar } from 'src/app/_entidades/procesar';
import { Productos } from 'src/app/_entidades/productos';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.css']
})
export class EmpresaComponent implements OnInit {

  ruta = `${RUTA}/catalogos/descargarproducto/`;
  rutaproducto = `${RUTA}/catalogos/descargarimagenproducto/`;

  carritoVisible: boolean = false;

  gestion: number = new Date().getFullYear();

  estado: string = '';

  id: number;

  datos: Productos[] = [];
  dato: Productos;
  carrito: Carritos;
  atributosProducto: Carritos;
  cantidadcarrito: number;
  carritos: Carritos[] = [];
  carritosAgrupados: any = {};
  totalAPagar: number = 0;

  cargando: boolean = false;
  error: string = '';

  pagina: number = 1;
  numPaginas: number = 0;
  maxSize: number = 5;
  cantidad: number = 12;
  buscar: string = '';
  orden: string = 'asc';
  total: number = 0;

  totalencarrito = 0;
  encarrito = "";

  cantProd: number = 1;

  imagen: Carritos;

  formulario: FormGroup;
  submitted: boolean = false;

  formulariom: FormGroup;
  submittedm: boolean = false;

  procesar: Procesar;

  localapellidopat: string;
  localapellidomat: string;
  localnombre: string;
  localusuario: string;
  localcelular: number;
  localcorreo: string;

  showButton: boolean = false;
  isShow: boolean;
  topPosToStartShowing = 100;

  empresa: Empresas;
  productos: Productos[] = [];
  imagenEmpresa: any[];
  imagenCarousel: any[];

  constructor(
    private _route: ActivatedRoute,
    private _catalogosService: CatalogosService,
    private _carritosService: CarritosService,
    private _modalService: NgbModal,
    private _fb: FormBuilder,
    private _ruta: Router,
    private _mensajes: ToastrService,
    private utilsService: UtilsService,
    private _toast: ToastrService,
    private sanitizer: DomSanitizer
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
    this.fcantidadcarrito();
    this.fempresa(this.id);
    this.fproductos(this.id);
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

  mostrarMas(evento: any) {
    this.cargando = true;
    this.error = '';
    this.pagina = evento;
    this.fproductos(this.id);
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

  feliminar(id: number) {
    this._carritosService.eliminar(id).subscribe(data => {
      this.fdatoscarrito();
      this.fcantidadcarrito();
      this._toast.success('El producto ha sido borrado de su carrito.','Producto eliminado')
    });
  }

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

  fprocesa(contenido: any) {
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
    } else {
      this.fformulario(this.procesar);
      this._modalService.open(contenido, {
        backdrop: 'static',
        keyboard: false,
        size: 'lg'
      });
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
        Swal.fire('Proceso completado', 'La Unidad productora se comunicara con usted ya se mediante whastapp o su correo electrónico, gracias.', 'success');
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
        Swal.fire('Registro completado', 'Bienvenido a la Tienda Virtual de REACTIVA TIC.', 'success');
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

    Swal.fire('Saliendo del sistema', 'Gracias por utilizar la plataforma', 'success');
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
          this.localusuario = data.usuario;
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
          Swal.fire('Verifica tus datos!', 'Tu usuario o clave de acceso son incorrectos', 'warning');
        }
      },
      error => {
        if (error.status === 400) {
          Swal.fire('Error en la solicitud', 'Los datos enviados no son válidos. Verifica tu entrada y vuelve a intentarlo.', 'error');
        } else if (error.status === 401) {
          Swal.fire('Error de autenticación', 'Usuario no encontrado. Verifica tus datos y vuelve a intentarlo.', 'error');
        } else if (error.status === 404) {
          Swal.fire('Error de autenticación', 'Usuario o contraseña incorrectos. Verifica tu entrada y vuelve a intentarlo.', 'error');
        } else if (error.status === 500) {
          Swal.fire('Error del servidor', 'Ocurrió un problema en el servidor. Inténtalo más tarde.', 'error');
        } else {
          Swal.fire('Error', 'Ocurrió un error inesperado. Por favor, intenta nuevamente.', 'error');
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

  fatributos(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this._carritosService.atributosproducto(id).subscribe(
        (data) => {
          if (data) {
            this.atributosProducto = data;
            resolve(data);
          } else {
            resolve(null);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  fadicionar(producto: any, cantidad: number) {
    let idcliente = JSON.parse(localStorage.getItem('idcliente'));
    this.fatributos(producto.idproducto)
      .then(() => {
        if (this.atributosProducto) {
          let nuevoproducto = new Carritos();
          nuevoproducto.idcliente = idcliente;
          nuevoproducto.idproducto = producto.idproducto;
          nuevoproducto.imagen = this.atributosProducto.imagen;
          nuevoproducto.idprecio = this.atributosProducto.idprecio;
          nuevoproducto.idcolor = this.atributosProducto.idcolor;
          nuevoproducto.idmaterial = this.atributosProducto.idmaterial;
          nuevoproducto.idtamano = this.atributosProducto.idtamano;
          nuevoproducto.cantidad = cantidad;

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
                    this._toast.success('El producto ha sido agregado a su carrito.','Agregado')
                    this.utilsService.cerrarCargando();
                  },
                  error => {
                    this._toast.error('Ha ocurrido un error, no se pudo agregar a su carrito.','Error')
                  }
                );
              }
            });
        }else {
          Swal.fire({
            icon: 'warning',
            title: 'No se encontraron atributos',
            text: 'Los atributos del producto no se encontraron. Por favor, inténtalo de nuevo más tarde.',
          });
          this._toast.error('Producto no agregado al carrito.', 'Error');
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al obtener los atributos del producto. Intenta de nuevo más tarde.',
        });
        this._toast.error('Producto no agregado al carrito.', 'Error');
      });
  }

  fdescargar(rol: string) {
    if (rol == 'empresas') {
      this.imagenEmpresa = [];
      this._catalogosService.download(this.empresa?.idempresa, rol).subscribe((data) => {
        this.imagenEmpresa = data;
      });
    }
    if (rol == 'carousel') {
      this.imagenEmpresa = [];
      this._catalogosService.download(this.empresa?.idempresa, rol).subscribe((data) => {
        this.imagenCarousel = data;
      });
    }
  }

  sanitizarImagen(data: string, mimeType: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(`data:${mimeType};base64,${data}`);
  }

  fempresa(id: number) {
    this._catalogosService.datoempresa(id).subscribe(
      (data) => {
        this.empresa = data;
        this.fdescargar('empresas');
        this.fdescargar('carousel');
        this.cargando = false;
      },
      (error) => {
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

  fproductos(id: number) {
    this._catalogosService.datos(id.toString(),this.pagina, this.cantidad, this.buscar, this.orden).subscribe(
      (data) => {
        this.productos = data || [];
        this.cargando = false;
        this.scrollToTop();
      }, (error) => {
        this.cargando = false;
        if (error.status === 0) {
          this.error = `Error de conexión. Verifica tu conexión a internet.`;
        } else if (error.status === 404) {
          this.error = `Recurso no encontrado. Por favor, verifica la URL o intenta más tarde.`;
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

  fdetalle(id: number) {
    this.fatributos(id)
    .then(() => {
      const _ruta = `/catalogo/producto/${this.utilsService.cifrarId(id)}`;
      this._ruta.navigateByUrl(_ruta);
    })
    .catch((error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al ver los detalles del producto. Inténtalo de nuevo más tarde.',
      });
      this._toast.error('Producto no encontrado.', 'Error');
    });
  }
}
