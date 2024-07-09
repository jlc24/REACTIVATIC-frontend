import { Procesar } from './../_entidades/procesar';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccesoService } from './../_aods/acceso.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Carritos } from './../_entidades/carritos';
import { CarritosService } from './../_aods/carritos.service';
import { CatalogosService } from './../_aods/catalogos.service';
import { Component, OnInit } from '@angular/core';
import { Productos } from '../_entidades/productos';
import swal from 'sweetalert2';
import { Rubros } from '../_entidades/rubros';
import { Empresas } from '../_entidades/empresas';
import { ToastrService } from 'ngx-toastr';
import { RUTA } from '../_config/application';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css']
})
export class CatalogoComponent implements OnInit {

  ruta = `${RUTA}/catalogos/descargarproducto/`;
  rutaempresa = `${RUTA}/catalogos/descargarempresa/`;

  gestion: number = new Date().getFullYear();
  nombre: string = '';

  datos: Productos[];
  dato: Productos;
  carrito: Carritos;
  cantidadcarrito: Carritos;
  carritos: Carritos[];
  rubros: Rubros[];
  estalogueado: Boolean = false;

  datosempresa: Empresas;

  pagina: number = 0;
  numPaginas: number = 0;
  cantidad: number = 12;
  buscar: string = '';
  total: number = 0;
  estado: string = '';

  totalencarrito = 0;
  encarrito = "";

  imagen: any;

  formulario: FormGroup;
  submitted: boolean = false;

  formulariom: FormGroup;
  submittedm: boolean = false;

  procesar: Procesar;

  localnombre: string;
  localcelular: number;
  localcorreo: string;

  constructor(
    private _catalogosService: CatalogosService,
    private _carritosService: CarritosService,
    private _modalService: NgbModal,
    private _fb: FormBuilder,
    private _ruta: Router,
    private _mensajes: ToastrService,
  ) {
    let dato = JSON.parse(localStorage.getItem('idcliente'));
    if (dato === null) {
      let idcliente = Math.floor((Math.random() * 1000000) + 1);
      localStorage.setItem('idcliente', JSON.stringify(idcliente));
    }
    let localcelular = JSON.parse(localStorage.getItem('localcelular'));
    if (localcelular === null) {
      this.localcelular = null;
      this.localnombre = '';
      this.localcorreo = '';
    } else {
      this.localcelular = JSON.parse(localStorage.getItem('localcelular'));
      this.localnombre = JSON.parse(localStorage.getItem('localnombre'));
      this.localcorreo = JSON.parse(localStorage.getItem('localcorreo'));
    }
  }

  ngOnInit(): void {
    this.fdatos();
    this.frubros();
    this.fcantidadcarrito();
    this.fsolicitarproductoinit();
  }

  fcantidadcarrito() {
    let idcliente = JSON.parse(localStorage.getItem('idcliente'));
    this._carritosService.cantidadcarrito(idcliente).subscribe(data => {
      this.cantidadcarrito = data;
    });
  }

  frubros() {
    this._catalogosService.cantidadporrubros().subscribe(data => {
      this.rubros = data;
    });
  }

  fcantidad() {
    this._catalogosService.cantidad(this.buscar).subscribe((data) => {
      this.total = data;
    });
  }

  fbuscar() {
    this.pagina = 0;
    this.fdatos();
  }

  fbuscarrubro(buscar: string) {
    this.pagina = 0;
    this.buscar = buscar;
    this.fdatos();
  }

  fdatos() {
    this._catalogosService.datos(this.pagina, this.cantidad, this.buscar).subscribe((data) => {
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

  fadicionar(idproducto: number, cantidad: number, content: any) {
    let idcliente = JSON.parse(localStorage.getItem('idcliente'));
    let nuevoproducto = new Carritos();
    nuevoproducto.idcliente = idcliente;
    nuevoproducto.idproducto = idproducto;
    nuevoproducto.cantidad = cantidad;
    this._carritosService.adicionar(nuevoproducto).subscribe(data => {
      this.fcantidadcarrito();
      this.fsolicitarproductoinit();
      this._modalService.open(content);
    });
  }

  feliminar(idproducto: number) {
    let idcliente = JSON.parse(localStorage.getItem('idcliente'));
    let nuevoproducto = new Carritos();
    nuevoproducto.idcliente = idcliente;
    nuevoproducto.idproducto = idproducto;
    this._carritosService.eliminar(nuevoproducto).subscribe(data => {
      this._carritosService.datosl(idcliente).subscribe(data => {
        this.carritos = data;
      });
      this.fcantidadcarrito();
      swal.fire('Producto borrado', 'Producto borrado de su carrito', 'success');
    });
  }

  fsolicitar(content: any) {
    let idcliente = JSON.parse(localStorage.getItem('idcliente'));
    this._carritosService.datosl(idcliente).subscribe(data => {
      this.carritos = data;
      this._modalService.open(content);
    });
  };

  fregistrate() {
    this._modalService.dismissAll();
    this._ruta.navigateByUrl('/registros');
  }

  facceso() {
    this._modalService.dismissAll();
    this._ruta.navigateByUrl('/acceso');
  }

  fcerrar() {
    this._modalService.dismissAll();
  }

  fsolicitarproductoinit() {
    let idcliente = JSON.parse(localStorage.getItem('idcliente'));
    this._carritosService.datosl(idcliente).subscribe(data => {
      this.carritos = data;
    });
  };

  fsolicitarproducto(content: any) {
    let idcliente = JSON.parse(localStorage.getItem('idcliente'));
    this._carritosService.datosl(idcliente).subscribe(data => {
      this.carritos = data;
      this._modalService.open(content);
    });
  };

  fwhastapp(celular: string) {
    const ruta = 'https://api.whatsapp.com/send?phone=591' + celular + '"&text=Hola Me gustaria comunicarme contigo';
    window.open(ruta, '_blank');
  }

  fbuscaritemempresa(empresa: string) {
    this.buscar = empresa;
    this.fbuscar();
  }

  fempresa(empresa: Empresas, content: any) {
    this.datosempresa = empresa;
    this._modalService.open(content);
  }

  fprocesa(contenido: any) {
    let idcliente = JSON.parse(localStorage.getItem('idcliente'));
    this.procesar = new Procesar();
    this.procesar.idcliente = idcliente;
    if (this.localcelular != null) {
      let dato = new Procesar();
      dato.celular = this.localcelular;
      dato.correo = this.localcorreo;
      dato.nombre = this.localnombre;
      this.fformulario(dato);
      this.faceptar();
    } else {
      this.fformulario(this.procesar);
      this._modalService.open(contenido);
    }
  }

  fformulario(dato: Procesar) {
    this.formulario = this._fb.group({
      primerapellido: [dato.nombre, [Validators.required]],
      celular: [dato.celular, [Validators.required, Validators.pattern('[0-9]*'), Validators.min(60000000), Validators.max(79999999)]],
      correo: [dato.correo, [Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]]
    });
  }

  get f() {
    return this.formulario.controls;
  }

  faceptar() {
    console.log('ingreso cesar');
    this.procesar.nombre = this.formulario.value.primerapellido.toUpperCase();
    this.procesar.celular = this.formulario.value.celular;
    this.procesar.correo = this.formulario.value.correo;
    this._catalogosService.procesar(this.procesar).subscribe(data => {
      this.localcelular = this.procesar.celular;
      this.localnombre = this.procesar.nombre;
      this.localcorreo = this.procesar.correo;
      let idcliente = Math.floor((Math.random() * 1000000) + 1);
      localStorage.setItem('idcliente', JSON.stringify(idcliente));
      swal.fire('Proceso completado', 'La Unidad productora se comunicara con usted ya se mediante whastapp o su correo electrónico, gracias.', 'success');
      this.fsolicitarproductoinit();
      this.fcantidadcarrito();
      this._modalService.dismissAll();
    });
  }

  fcancelar() {
    this._modalService.dismissAll();
  }

  fsalir() {
    this.localcelular = null;
    this.localnombre = '';
    this.localcorreo = '';
    let idcliente = Math.floor((Math.random() * 1000000) + 1);
    localStorage.setItem('idcliente', JSON.stringify(idcliente));
    localStorage.setItem('localcelular', null);
    localStorage.setItem('localnombre', null);
    localStorage.setItem('localcorreo', null);
    swal.fire('Saliendo del sistema', 'Gracias por utilizar la plataforma', 'success');
  }

  faccesom(contenido: any){
    this.procesar = new Procesar();
    this.fformulariom();
    this._modalService.open(contenido);
  }

  fformulariom() {
    this.formulariom = this._fb.group({
      clave: ['', [Validators.required]],
      celular: ['', [Validators.required, Validators.pattern('[0-9]*'), Validators.min(60000000), Validators.max(79999999)]]
    });
  }

  get fm() {
    return this.formulariom.controls;
  }

  faceptarm(){
    this.submittedm = true;
    this.procesar.celular = this.formulariom.value.celular;
    this.procesar.clave = this.formulariom.value.clave;
    this._catalogosService.usuariocatalogo(this.procesar).subscribe( data => {
      if (data!= null) {
        this.localcelular = data.celular;
        this.localnombre = data.nombre;
        this.localcorreo = data.correo;
        localStorage.setItem('localcelular', JSON.stringify(this.localcelular));
        localStorage.setItem('localnombre', JSON.stringify(this.localnombre));
        localStorage.setItem('localcorreo', JSON.stringify(this.localcorreo));
        this._modalService.dismissAll();
        swal.fire('Ingresando al Sistema', 'Gracias por utilizar la plataforma', 'success');
      } else {
        swal.fire('Verifica tus datos!', 'Tu usuario ó contraseña son incorrectos', 'warning');
      }
    });

  }

  fdetalle(id: number) {
    const _ruta = '/catalogo/' + id;
    this._ruta.navigateByUrl(_ruta);
  }

}