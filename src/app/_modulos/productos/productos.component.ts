import { DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductosService } from 'src/app/_aods/productos.service';
import { Productos } from 'src/app/_entidades/productos';
import swal from 'sweetalert2';
import { RUTA } from 'src/app/_config/application';


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

  pagina:number = 0;
  numPaginas:number = 0;
  cantidad:number = 10;
  buscar:string = '';
  total:number = 0;
  estado:string = '';

  formulario: FormGroup;
  submitted:boolean = false;

  imagen: any;

  imageSrc: string;


  constructor(
    private _productosService: ProductosService,
    private _fb: FormBuilder,
    private _modalService: NgbModal,
    private _sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
    this.fdatos();
  }

  fcantidad() {
    this._productosService.cantidad(this.buscar).subscribe((data) => {
      this.total = data;
    });
  }

  fbuscar() {
    this.pagina = 0;
    this.fdatos();
  }

  fdatos() {
    this._productosService.datos(this.pagina, this.cantidad, this.buscar).subscribe((data) => {
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

  fformulario(dato: Productos) {
    this.formulario = this._fb.group({
      producto: [
        dato.producto,
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z\u00f1\u00d1\\s]+$'),
          Validators.maxLength(50)
        ]
      ],
      descripcion: [
        dato.descripcion,
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9.,\u00f1\u00d1\\s]+$'),
          Validators.maxLength(255)
        ]
      ],
      //preciocompra: [dato.preciocompra, [ Validators.pattern('[0-9.]*')]],
      precioventa: [
        dato.precioventa,
        [
          Validators.required,
          Validators.pattern('^[0-9.,]+$')
        ]
      ],
      //cantidad: [dato.cantidad, [ Validators.pattern('[0-9]*')]],
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
        input = input.replace(/[^a-zA-ZÀ-ÿ\u00f1\u00d1\s]/g, '');
        break;
      case 'numeros':
        input = input.replace(/[^0-9]/g, '');
        break;
      case 'letrasynumerosguion':
        input = input.replace(/[^a-zA-Z0-9.,\u00f1\u00d1\s]/g, '');
        break;
    }
    this.formulario.get(controlName)?.setValue(input, { emitEvent: false });
  }

  fadicionar(content: any) {
    this.estado = 'Adicionar';
    this.dato = new Productos();
    this.fformulario(this.dato);
    this._modalService.open(content);
  }

  fmodificar(id: number, content: any) {
    this.estado = 'Modificar';
    this._productosService.dato(id).subscribe((data) => {
      this.imageSrc = null;
      this.dato = data;
      this.fformulario(this.dato);
      /* this.fdescargar(this.dato.idproducto); */
      this._modalService.open(content);
    });
  }

  faceptar(): void {
    this.submitted = true;
    this.dato.producto = this.formulario.value.producto.toUpperCase();
    this.dato.descripcion = this.formulario.value.descripcion;
    //this.dato.preciocompra = this.formulario.value.preciocompra;
    this.dato.precioventa = this.formulario.value.precioventa;
    //this.dato.cantidad = this.formulario.value.cantidad;
    if (this.estado === 'Modificar') {
      this._productosService.modificar(this.dato).subscribe((data) => {
        this.fcargar(this.dato.idproducto);
        this._modalService.dismissAll();
        swal.fire('Dato modificado', 'Dato modificado con exito', 'success');
        this.fdatos();
      });
    } else {
      this._productosService.adicionar(this.dato).subscribe((data) => {
        this.dato = data;
        this.fcargar(this.dato.idproducto);
        this._modalService.dismissAll();
        swal.fire('Dato adicionado', 'Dato modificado con exito', 'success');
        this.fdatos();
      });
    }

  }

  fseleccionarArchivo(event) {
    const reader = new FileReader();
    this.archivoseleccionado = event.target.files[0];
    if (event.target.files[0] && event.target.files.length) {
      const file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imageSrc = reader.result as string;
      };
    }
  }


  fcargar(id: number) {
    this._productosService.cargarImagenp(this.archivoseleccionado, id).subscribe((data) => {
      this.fdatos();
    });
  }

  /* fdescargar(id: number) {
    this.imagen = null;
    this._productosService.descargarproducto(id).subscribe(data=>{
      const objectURL = window.URL.createObjectURL(data);
      this.imagen = this._sanitizer.bypassSecurityTrustUrl(objectURL);
    });
  } */


  fcancelar() {
    this._modalService.dismissAll();
  }

  feliminar(id: number){
    swal
      .fire({
        title: 'Estás seguro?',
        icon: 'warning',
        text: 'No podrás revertir el borrado de esta imagen!',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Borrar',
      })
      .then((result) => {
        if (result.value) {
          this._productosService.eliminarImagenp(id).subscribe( data => {
            this.fdatos();
            swal.fire('Imagen eliminda', 'Imagen eliminada con exito', 'success');
          });
        }
      });
  }

}

