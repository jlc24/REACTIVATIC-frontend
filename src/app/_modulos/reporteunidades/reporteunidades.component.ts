import { Component, OnInit } from '@angular/core';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { EmpresasService } from 'src/app/_aods/empresas.service';
import { MunicipiosService } from 'src/app/_aods/municipios.service';
import { ReportesService } from 'src/app/_aods/reportes.service';
import { RubrosService } from 'src/app/_aods/rubros.service';
import { Municipios } from 'src/app/_entidades/municipios';
import { Reportes } from 'src/app/_entidades/reportes';
import { Rubros } from 'src/app/_entidades/rubros';

@Component({
  selector: 'app-reporteunidades',
  templateUrl: './reporteunidades.component.html',
  styleUrls: ['./reporteunidades.component.css']
})
export class ReporteunidadesComponent implements OnInit {

  allSelectedRep: boolean = true;
  allSelectedEmp: boolean = true;
  municipios: Municipios[];
  rubros: Rubros[];
  fechaRegistro: Reportes[];

  columnsemp: string[] = [];
  columnsrub: string[] = [];
  columnsmun: string[] = [];
  columnsrep: string[] = [];
  columnsper: string[] = [];

  selectedMunicipio: string = 'allM';
  selectedRubro: string = 'allR';
  selectedFecharegistro: string = 'allReg';
  selectedOrden: string = 'e.fechareg';
  selectedDireccion: string = 'ASC';

  optionsRep = [
    { id: 'idrepresentante', label: 'Nombre Completo', selected: true },
    //{ id: 'genero', label: 'Genero', selected: true },
    { id: 'dip', label: 'Cédula de Identidad', selected: true },
    { id: 'celular', label: 'Teléfono/Celular', selected: true },
    { id: 'formacion', label: 'Nivel de Educación', selected: true },
    { id: 'estadocivil', label: 'Estado Civil', selected: true },
    { id: 'hijos', label: 'Número de Hijos', selected: true }
  ];
  optionsEmp = [
    { id: 'nform', label: 'Formulario', selected: true },
    { id: 'empresa', label: 'Razón Social', selected: true },
    { id: 'nit', label: 'NIT', selected: true },
    { id: 'bancamovil', label: 'Banca Movil', selected: true },
    { id: 'fechaapertura', label: 'Fecha Apertura', selected: true },
    { id: 'fechareg', label: 'Fecha Registro', selected: true },
    { id: 'idrubro', label: 'Rubro', selected: true },
    { id: 'servicios', label: 'Servicios', selected: true },
    { id: 'capacidad', label: 'Producción', selected: true },
    { id: 'motivo', label: 'Motivo', selected: true },
    { id: 'familiar', label: 'Familiar', selected: true },
    { id: 'involucrados', label: 'Involucrados', selected: true },
    { id: 'trabajadores', label: 'Trabajadores', selected: true },
    { id: 'participacion', label: 'Ferias', selected: true },
    { id: 'capacitacion', label: 'Capacitación', selected: true },
    { id: 'idmunicipio', label: 'Municipio', selected: true },
    { id: 'zona', label: 'Zona', selected: true },
    { id: 'direccion', label: 'Dirección', selected: true },
    { id: 'referencia', label: 'Referencia', selected: true },
    { id: 'transporte', label: 'Transporte', selected: true },
    //{ id: 'carnet', label: 'Carnet', selected: true },
  ];

  constructor(
    private _municipiosService: MunicipiosService,
    private _rubrosService: RubrosService,
    private _reportesService: ReportesService,
    private _empresasService: EmpresasService,
    private _toastService: ToastrService
  ) { }

  ngOnInit(): void {
    this.fmunicipios();
    this.frubros();
    this.ffechareg();
    this.updateColumns();
  }

  toggleAllSelectionsRep(event: Event): void {
    this.allSelectedRep = (event.target as HTMLInputElement).checked;
    this.optionsRep.forEach(option => option.selected = this.allSelectedRep);
    this.updateColumns();
  }

  checkIfAllSelectedRep(): void {
    this.allSelectedRep = this.optionsRep.every(option => option.selected);
    this.updateColumns();
  }

  updateColumns(): void {
    this.columnsemp = [];
    this.columnsrub = [];
    this.columnsmun = [];
    this.columnsrep = [];
    this.columnsper = [];
    this.optionsEmp.forEach(option => {
      if (option.selected && option.id !== 'idrubro' && option.id !== 'idmunicipio') {
          this.columnsemp.push(option.id);
      }
  });
    const isRubroSelected = this.optionsEmp.find(option => option.id === 'idrubro' && option.selected);
    if (isRubroSelected) {
        this.columnsrub.push('idrubro');
        this.columnsrub.push('rubro');
    }
    const isMunicipioSelected = this.optionsEmp.find(option => option.id === 'idmunicipio' && option.selected);
    if (isMunicipioSelected) {
        this.columnsmun.push('idmunicipio');
        this.columnsmun.push('municipio');
    }
    const isRepresentanteSelected = this.optionsRep.find(option => option.id === 'idrepresentante' && option.selected);
    if (isRepresentanteSelected) {
        this.columnsrep.push('idrepresentante');
        this.columnsper.push('idpersona');
        this.columnsper.push('primerapellido');
        this.columnsper.push('segundoapellido');
        this.columnsper.push('primernombre');
    }

    this.optionsRep.forEach(option => {
        if (option.selected && option.id !== 'idrepresentante') {
            this.columnsper.push(option.id);
        }
    });

    const uniqueColumnsPer = Array.from(new Set(this.columnsper));

    console.log('Columns for Empresas:', this.columnsemp);
    console.log('Columns for Rubros:', this.columnsrub);
    console.log('Columns for Municipio:', this.columnsmun);
    console.log('Columns for Representantes:', this.columnsrep);
    console.log('Columns for Personas:', uniqueColumnsPer);
  }

  toggleAllSelectionsEmp(event: Event): void {
    this.allSelectedEmp = (event.target as HTMLInputElement).checked;
    this.optionsEmp.forEach(option => option.selected = this.allSelectedEmp);
    this.updateColumns();
  }

  checkIfAllSelectedEmp(): void {
    this.allSelectedEmp = this.optionsEmp.every(option => option.selected);
    this.updateColumns();
  }

  fmunicipios(){
    this._municipiosService.datosl().subscribe((data) => {
      this.municipios = data;
    });
  }

  frubros(){
    this._rubrosService.datosl().subscribe((data) => {
      this.rubros = data;
    });
  }

  ffechareg(){
    this._reportesService.empresasporgestion().subscribe((data) => {
      this.fechaRegistro = data;
    });
  }

  fdatoPDF(){

  }

  fdatoXLS(){
    this._empresasService.datosXLS(this.columnsemp, this.columnsrub, this.columnsmun, this.columnsrep, this.columnsper, this.selectedMunicipio, this.selectedRubro, this.selectedFecharegistro, this.selectedOrden, this.selectedDireccion)
    .subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.setAttribute("style", "display:none;");
      document.body.appendChild(a);
      a.href = url;
      a.download = "Base_datos_UP_REACTIVA_TIC.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      return url;
    }, error => {
      this._toastService.error('Error al descargar el archivo', 'Error');
    });
  }

}
