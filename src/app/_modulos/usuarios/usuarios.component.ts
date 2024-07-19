import { PersonasService } from './../../_aods/personas.service';
import { Personas } from './../../_entidades/personas';
import { TiposdocumentosService } from 'src/app/_aods/tiposdocumentos.service';
import { Tiposdocumentos } from 'src/app/_entidades/tiposdocumentos';
import { TiposextensionesService } from 'src/app/_aods/tiposextensiones.service';
import { Tiposextensiones } from 'src/app/_entidades/tiposextensiones';
import { TiposgenerosService } from 'src/app/_aods/tiposgeneros.service';
import { Tiposgeneros } from 'src/app/_entidades/tiposgeneros';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { UsuariosService } from 'src/app/_aods/usuarios.service';
import { Usuarios } from 'src/app/_entidades/usuarios';
import swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
})
export class UsuariosComponent implements OnInit {
  datos: Usuarios[];
  dato: Personas;
  documento: Tiposdocumentos[];
  extensiones: Tiposextensiones[];
  generos: Tiposgeneros[];

  pagina: number = 0;
  numPaginas: number = 0;
  cantidad: number = 10;
  buscar: string = '';
  total: number = 0;
  estado: string = '';

  formulario: FormGroup;
  submitted: boolean = false;

  constructor(
    private _usuariosService: UsuariosService,
    private _personasService: PersonasService,
    private _documentoService: TiposdocumentosService,
    private _extensionesService: TiposextensionesService,
    private _generosService: TiposgenerosService,
    private _fb: FormBuilder,
    config: NgbModalConfig,
    private _modalService: NgbModal
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
    this.fdatos();
  }

  fdocumento() {
    
  }

  fcantidad() {
    this._usuariosService.cantidad(this.buscar).subscribe((data) => {
      this.total = data;
    });
  }

  fbuscar() {
    this.pagina = 0;
    this.fdatos();
  }

  fdatos() {
    this._usuariosService
      .datos(this.pagina, this.cantidad, this.buscar)
      .subscribe((data) => {
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

  fformulario(dato: Personas) {
    this.formulario = this._fb.group({
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
      // segundonombre: [dato.segundonombre],
      fechanacimiento: [
        dato.fechanacimiento, 
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
      complemento:[
        dato.numerocomplementario,
        [
          Validators.pattern('^[a-zA-Z0-9\u00f1\u00d1]+$'),
          Validators.maxLength(5)
        ]
      ],
      expedido:[
        dato.idtipoextension,
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z]+$'),
          Validators.maxLength(5)
        ]
      ],
      direccion: [
        dato.direccion, 
        [
          Validators.required,
          Validators.maxLength(255)
        ]
      ],
      telefono: [
        dato.telefono, 
        [
          Validators.pattern('^[0-9]+$'),
          Validators.maxLength(15)
        ],
      ],
      celular: [
        dato.celular,
        [
          Validators.required, 
          Validators.pattern('^[0-9]+$'),
          Validators.maxLength(15)
        ],
      ],
      correo: [
        dato.correo,
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'),
          Validators.maxLength(255)
        ],
      ],
      usuario: [
        
      ]
    });
  }

  get f() {
    return this.formulario.controls;
  }

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
        input = input.replace(/[^a-zA-Z0-9\u00f1\u00d1]/g, '');
        break;
    }
    this.formulario.get(controlName)?.setValue(input.toUpperCase(), { emitEvent: false });
  }

  fadicionar(content: any) {
    this.estado = 'Adicionar';
    this.dato = new Personas();
    this.fformulario(this.dato);
    this._modalService.open(content, { size: 'lg' });
  }

  fmodificar(id: number, content: any) {
    this.estado = 'Modificar';
    this._personasService.dato(id).subscribe((data) => {
      this.dato = data;
      this.fformulario(this.dato);
      this._modalService.open(content, { size: 'lg' });
    });
  }
  fver(id: number, content: any) {
    this.estado = 'Ver';
    this._personasService.dato(id).subscribe((data) => {
      this.dato = data;
      this.fformulario(this.dato);
      this._modalService.open(content, { size: 'lg' });
    });
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
          this._usuariosService.eliminar(id).subscribe((data) => {
            this.fdatos();
          });
        }
      });
  }

  faceptar(): void {
    this.submitted = true;

    this.dato.primerapellido = this.formulario.value.primerapellido.toUpperCase();
    this.dato.fechanacimiento = this.formulario.value.fechanacimiento;
    this.dato.dip = this.formulario.value.dip;
    this.dato.direccion = this.formulario.value.direccion.toUpperCase();
    this.dato.telefono = this.formulario.value.telefono;
    this.dato.celular = this.formulario.value.celular;
    this.dato.correo = this.formulario.value.correo;

    if (this.estado === 'Modificar') {
      this._personasService.modificar(this.dato).subscribe((data) => {
        this.fdatos();
        this._modalService.dismissAll();
        swal.fire('Dato modificado', 'Dato modificado con exito', 'success');
      });
    } else {
      this._personasService.adicionar4(this.dato).subscribe((data) => {
        this.fdatos();
        this._modalService.dismissAll();
        swal.fire('Dato adicionado', 'Dato modificado con exito', 'success');
      });
    }
  }

  fcancelar() {
    this._modalService.dismissAll();
  }

  fdatosXLS() {
    this._usuariosService.datosXLS(this.buscar).subscribe(data => {
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
    this._usuariosService.datosPDF(this.buscar).subscribe(data => {
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
