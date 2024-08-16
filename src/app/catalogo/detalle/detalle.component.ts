import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AccesoService } from 'src/app/_aods/acceso.service';
import { CarritosService } from 'src/app/_aods/carritos.service';
import { CatalogosService } from 'src/app/_aods/catalogos.service';
import { RUTA } from 'src/app/_config/application';
import { Carritos } from 'src/app/_entidades/carritos';
import { Empresas } from 'src/app/_entidades/empresas';
import { Procesar } from 'src/app/_entidades/procesar';
import { Productos } from 'src/app/_entidades/productos';
import { Rubros } from 'src/app/_entidades/rubros';
import Swal from 'sweetalert2';
import swal from 'sweetalert2';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  ruta = `${RUTA}/catalogos/descargarproducto/`;
  rutaempresa = `${RUTA}/catalogos/descargarempresa/`;

  gestion: number = new Date().getFullYear();
  nombre: string = '';

  id: number;

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

  cantProd: number = 1;

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
    private _route: ActivatedRoute,
    private _catalogosService: CatalogosService,
    private _carritosService: CarritosService,
    private _modalService: NgbModal,
    private _fb: FormBuilder,
    private _ruta: Router
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
    this.id = this._route.snapshot.params['id'];
    this.fdato(this.id);
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
    this._catalogosService.rubros().subscribe(data => {
      this.rubros = data;
    });
  }

  fcantidad() {
    this._catalogosService.cantidad(this.buscar).subscribe((data) => {
      this.total = data;
    });
  }

  fdato(id: number) {
    this._catalogosService.dato(id).subscribe((data) => {
      this.dato = data;
    });
  }

  fmas(){
    this.cantProd++;
  }

  fmenos(){
    if (this.cantProd > 1) {
      this.cantProd--;
    }
  }

  fadicionar(idproducto: number, cantidad: number) {
    let idcliente = JSON.parse(localStorage.getItem('idcliente'));
    let nuevoproducto = new Carritos();
    nuevoproducto.idcliente = idcliente;
    nuevoproducto.idproducto = idproducto;
    nuevoproducto.cantidad = cantidad;

    // this._carritosService.adicionar(nuevoproducto).subscribe(data => {
    //   this.fcantidadcarrito();
    //   this.fsolicitarproductoinit();
    //   this._modalService.open(content);
    // });
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¿Quieres agregar este producto al carrito?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, agregar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this._carritosService.adicionar(nuevoproducto).subscribe(data => {
          this.fcantidadcarrito();
          this.fsolicitarproductoinit();
          Swal.fire( 'Agregado', 'El producto ha sido agregado al carrito.', 'success' );
        });
      }
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
      this._modalService.open(content, { size: 'lg' });
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
    this.submitted = true;
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
      if (data != null) {
        this.localcelular = data.celular;
        this.localnombre = data.nombre;
        this.localcorreo = data.correo;
        localStorage.setItem('localcelular', JSON.stringify(this.localcelular));
        localStorage.setItem('localnombre', JSON.stringify(this.localnombre));
        localStorage.setItem('localcorreo', JSON.stringify(this.localcorreo));
        this._modalService.dismissAll();
      } else {
        swal.fire('Verifica tus datos!', 'Tu usuario ó contraseña son incorrectos', 'warning');
      }
    });

  }

  finicio(){
    const _ruta = '/catalogo';
    this._ruta.navigateByUrl(_ruta);
  }

}
