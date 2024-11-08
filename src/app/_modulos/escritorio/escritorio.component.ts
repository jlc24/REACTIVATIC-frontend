import { Component, ElementRef, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AccesoService } from 'src/app/_aods/acceso.service';
import { UsuariosService } from 'src/app/_aods/usuarios.service';
import { EmpresasService } from 'src/app/_aods/empresas.service';
import { MunicipiosService } from 'src/app/_aods/municipios.service';
import { ProductosService } from 'src/app/_aods/productos.service';
import { SolicitudesService } from 'src/app/_aods/solicitudes.service';
import { ReportesService } from 'src/app/_aods/reportes.service';
import { Reportes } from 'src/app/_entidades/reportes';
import { Chart } from 'angular-highcharts';
import { Graficos } from 'src/app/_entidades/graficos';
import { BeneficiosService } from 'src/app/_aods/beneficios.service';
import { Beneficios } from 'src/app/_entidades/beneficios';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-escritorio',
  templateUrl: './escritorio.component.html',
  styleUrls: ['./escritorio.component.css'],
})
export class EscritorioComponent implements OnInit, AfterViewInit {

  chart1: Chart;
  series1: Array<Graficos> = [];
  empresasgestion: Reportes[];

  beneficios: Beneficios[];

  escliente: boolean =false;
  esempresa: boolean =false;
  esreactivatic: boolean =false;
  essddpi: boolean =false;
  esadmin: boolean =false;
  buscar: string = '';
  rubro: string = '';
  totalusuarios: number = 0;
  totalempresas: number = 0;
  totalmunicipios: number = 0;
  totalproductos: number = 0;
  totalsolicitudesventaP: number = 0;
  totalsolicitudesventaR: number = 0;

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

  @ViewChild('calendar', { static: false }) calendarE1: ElementRef;

  currColor: string = '#3c8dbc';
  calendar: any;

  constructor(
    private _usuariosService: UsuariosService,
    private _beneficiosService: BeneficiosService,
    private _empresasService: EmpresasService,
    private _municipiosService: MunicipiosService,
    private _productosService: ProductosService,
    private _solicitudesService: SolicitudesService,
    private _accesoService: AccesoService,
    private _reportesService: ReportesService,
    private _ruta: Router
  ) {}

  ngOnInit() {
    this.escliente = this._accesoService.esRolClientes();
    this.esempresa = this._accesoService.esRolEmpresa();
    this.esreactivatic = this._accesoService.esRolReactivatic();
    this.essddpi = this._accesoService.esRolSddpi();
    this.esadmin = this._accesoService.esRolAdmin();
    this.fcantidadusuarios();
    this.fcantidadempresas();
    this.fcantidadmunicipios();
    this.fcantidadproductos();
    this.fempresasgestion();
    if (this.esempresa) {
      this.fcantidadventap();
      this.fcantidadventar();
    }

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
  }

  ngAfterViewInit() {
    this.initializeCalendar();
  }

  beneficioColors = {
    "CAPACITACION TECNICA": "#f56954",
    "CURSO": "#960023",
    "TALLER": "#0073b7",
    "FERIA": "#FF5919",
    "SEMINARIO": "#00a65a",
    "CAPACITACION ESPECIALIZADA": "#3c8dbc",
    "RUEDA DE NEGOCIOS": "#d81b60"
  };

  fbeneficios(){
    this._beneficiosService.lista().subscribe((data) => {
      const events = data.map(item => ({
        id: item.idbeneficio,
        title: item.beneficio,
        start: item.fechainicio,
        end: item.fechafin,
        description: item.descripcion,
        location: item.direccion,
        backgroundColor: this.beneficioColors[item.tipobeneficio?.tipobeneficio] || '#000',
        borderColor: this.beneficioColors[item.tipobeneficio?.tipobeneficio] || '#000'
      }));

      this.calendar?.removeAllEvents();
      events.forEach(event => this.calendar.addEvent(event));
    });
  }

  initializeCalendar() {
    const calendarEl = this.calendarE1.nativeElement;
    const FullCalendar = (window as any).FullCalendar;

    this.calendar = new FullCalendar.Calendar(calendarEl, {
      headerToolbar: {
        left: 'prev',
        center: 'title',
        right: 'next'
      },
      locale: 'es',
      editable: false,
      droppable: false,
      selectable: false,
      selectMirror: false,

      eventClick: (arg) => {
        const event = arg.event;
        Swal.fire({
          title: event.title,
          html: `<strong>Ubicación:</strong> ${event.extendedProps.location}<br>
                 <strong>Fecha Inicio:</strong> ${event.start?.toLocaleString()}<br>
                 <strong>Fecha Fin:</strong> ${event.end?.toLocaleString()}`,
          icon: 'info',
          confirmButtonText: 'Cerrar',
          confirmButtonColor: '#007bff'
        });
      }
    });

    this.calendar.render();
    this.fbeneficios();
  }

  setColor(color: string) {
    this.currColor = color;
    const addNewEventBtn = document.getElementById('add-new-event') as HTMLButtonElement;
    addNewEventBtn.style.backgroundColor = color;
    addNewEventBtn.style.borderColor = color;
  }

  fmiscompras() {
    this._ruta.navigate(['solicitudescompra']);
  }

  fmisventas() {
    this._ruta.navigate(['solicitudesventa']);
  }

  fusuario(){
    this._ruta.navigate(['usuarios']);
  }
  funidadprod(){
    this._ruta.navigate(['empresas']);
  }
  fmunicipio(){
    this._ruta.navigate(['municipios']);
  }
  fproductos(){
    this._ruta.navigate(['productos']);
  }

  fcantidadusuarios() {
    // this.esadmin = this._accesoService.esRolAdmin();
    // this.essddpi = this._accesoService.esRolSddpi();
    // this.esreactivatic = this._accesoService.esRolReactivatic();
    if (this.esadmin) {
      this._usuariosService.cantidad(this.buscar).subscribe((data) => {
        this.totalusuarios = data;
      });
    }
    if (this.essddpi) {
      this._usuariosService.cantidadsddpi(this.buscar).subscribe((data) => {
        this.totalusuarios = data;
      });
    }
    if (this.esreactivatic) {
      this._usuariosService.cantidadreactivatic(this.buscar).subscribe((data) => {
        this.totalusuarios = data;
      });
    }
  }

  fcantidadempresas() {
    this.esCargoTextil = this._accesoService.esCargoTextil();
    this.esCargoArtesania = this._accesoService.esCargoArtesania();
    this.esCargoAlimento = this._accesoService.esCargoAlimentos();
    this.esCargoTecnologia = this._accesoService.esCargoTecnologia();
    this.esCargoEncargado = this._accesoService.esCargoEncargado();
    this.esCargoAdministrador = this._accesoService.esCargoAdministrador();
    if (this.esCargoTextil) {
      this.rubro = 'TEXTIL';
    }else if (this.esCargoArtesania) {
      this.rubro = 'ARTESANIA';
    }else if(this.esCargoAlimento){
      this.rubro = 'ALIMENTOS';
    }else{
      this.rubro = ''
    }
    this._empresasService.cantidad(this.buscar, this.rubro).subscribe((data) => {
      this.totalempresas = data;
    });
  }

  fcantidadmunicipios() {
    this._municipiosService.cantidad(this.buscar).subscribe((data) => {
      this.totalmunicipios = data;
    });
  }

  fcantidadproductos(){
    if (this.esempresa) {
      this._productosService.cantidad(this.buscar).subscribe((data) => {
        this.totalproductos = data;
      });
    }else{
      this._productosService.cantidadtotal(this.buscar).subscribe((data) => {
        this.totalproductos = data;
      });
    }
  }

  fcantidadventap(){
    this._solicitudesService.cantidadvp().subscribe((data) => {
      this.totalsolicitudesventaP = data;
    });
  }

  fcantidadventar(){
    this._solicitudesService.cantidadvr().subscribe((data) => {
      this.totalsolicitudesventaR = data;
    });
  }

  fempresasgestion(){
    this._reportesService.empresasporgestion().subscribe((data) => {
      this.empresasgestion = data;
      this.fgraficos(this.empresasgestion);
    });
  }

  fgraficos(datos: { entidad: string, cantidad: number }[]) {
    for (let index = 0; index < datos.length; index++) {
      let serie = new Graficos();
      serie.name = datos[index].entidad;
      serie.y = datos[index].cantidad;
      this.series1.push(serie);
    }
    this.series1 = [];

    datos.forEach(dato => {
      let color = `#${Math.floor(Math.random()*16777215).toString(16)}`;
      let serie = { name: dato.entidad, y: dato.cantidad, color: color };
      this.series1.push(serie);
    });

    this.chart1 = new Chart({
      chart: {
        type: 'column'
      },
      title: {
        text: ''
      },
      xAxis: {
        categories: datos.map(d => d.entidad),
        title: {
          text: 'Año'
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Cantidad de Empresas'
        }
      },
      plotOptions: {
        column: {
          depth: 35,
          colorByPoint: true,
          // enableMouseTracking: false,
          // allowPointSelect: false
        },
        series: {
          states: {
            inactive: {
              opacity: 1
            }
          }
        }
      },
      series: [{
        name: 'Empresas',
        type: 'column',
        data: this.series1,
        showInLegend: false
      }]
    });
  }

}
