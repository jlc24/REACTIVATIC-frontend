import { Component, OnInit, OnDestroy } from '@angular/core';
import { BeneficiosService } from 'src/app/_aods/beneficios.service';
import { BeneficiosempresasService } from 'src/app/_aods/beneficiosempresas.service';
import { TradesService } from 'src/app/_aods/trades.service';
import { RUTA } from 'src/app/_config/application';
import { Beneficios } from 'src/app/_entidades/beneficios';
import { Beneficiosempresas } from 'src/app/_entidades/beneficiosempresas';
import { Negocios } from 'src/app/_entidades/negocios';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {

  ruta = `${RUTA}/catalogos/descargarempresa/`;

  beneficio: Beneficios;
  negocios: Negocios[];
  negocio: Negocios;

  buscarnegocios: string = '';

  totalcitas: number = 0;

  isSameDate: boolean = false;

  timers: { [key: string]: any[] } = {};

  horaActual: string = '';
  private intervalId: any;

  estadoempresa: number = 0;
  estadopersona: number = 0;

  constructor(
    private _beneficiosService: BeneficiosService,
    private _tradesService: TradesService,
  ) { }

  ngOnInit(): void {
    this.fnegocios();
    this.actualizarHora();
    this.intervalId = setInterval(() => this.actualizarHora(), 1000);
    this.intervalId = setInterval(() => this.programarEstadosParaNegocios(), 30000);
  }

  ngOnDestroy(): void {
    //this.limpiarTodosLosTimers(); // Limpiar timers al destruir el componente
    clearInterval(this.intervalId);
  }

  actualizarHora(): void {
    const ahora = new Date();
    this.horaActual = ahora.toLocaleTimeString('en-US', { hour12: false });
  }

  getBadgeClass(estado: number): string {
    switch (estado) {
      case 1: return 'badge-success'; // En curso
      case 2: return 'badge-secondary'; // Ausente
      case 3: return 'badge-custom';  // Cancelado
      case 4: return 'badge-warning';    // Por iniciar
      case 5: return 'badge-info'; // Finalizado
      case 6: return 'badge-primary';  // Cancelado
      case 7: return 'badge-dark';    // Por iniciar
      case 8: return 'badge-danger'; // Finalizado
      default: return 'badge-light';  // Por defecto (sin estado)
    }
  }

  getBadgeText(estado: number): string {
    switch (estado) {
      case 1: return 'En curso';
      case 2: return 'Ausente';
      case 3: return 'Cancelado';
      case 4: return 'Pendiente';
      case 5: return 'Confirmado';
      case 6: return 'Por iniciar';
      case 7: return 'Reprogramado';
      case 8: return 'Finalizado';
      default: return 'Desconocido';
    }
  }

  fnegocios(){
    this._beneficiosService.negocios().subscribe((data) => {
      this.beneficio = data;
      const fechaInicio = new Date(this.beneficio.fechainicio);
      const fechaFin = new Date(this.beneficio.fechafin);
      this.isSameDate = fechaInicio.toDateString() === fechaFin.toDateString();
      this.fdatos();
    });
  }

  fbuscarnegocios(){
    this.fdatos();
  }

  fcantidad(){
    this._tradesService.cantidad(this.buscarnegocios, this.beneficio.idbeneficio).subscribe(data => {
      this.totalcitas = data;
    });
  }

  fdatos(){
    this._tradesService.datos(this.buscarnegocios, this.beneficio.idbeneficio).subscribe(data => {
      this.negocios = data;
      this.fcantidad();
      //this.programarEstadosParaNegocios();
    });
  }

  programarEstadosParaNegocios(): void {
    this.negocios.forEach(negocio => {
      const horaActual = new Date();
      const horaInicio = new Date(`${negocio.fecha}T${negocio.horainicio}`);
      const horaFin = new Date(`${negocio.fecha}T${negocio.horafin}`);
  
      if (horaInicio.getTime() - horaActual.getTime() <= 5 * 60 * 1000 && 
          horaActual.getTime() < horaInicio.getTime() && 
          negocio.estadoempresa !== 4 && negocio.estadoempresa === 6
        ) {
        this.estadoempresa = 4; // Pendiente
        this.estadopersona = 4; // Pendiente
        this.fmodificarestados(negocio);
      }
  
      else if (horaActual.getTime() >= horaInicio.getTime() && horaActual.getTime() <= horaFin.getTime()) {
        let estadoModificado = false;
        if (negocio.estadoempresa === 5 && this.estadoempresa !== 1) {
          this.estadoempresa = 1; // En curso
          estadoModificado = true;
        } else if (negocio.estadoempresa === 4 && this.estadoempresa !== 2) {
          this.estadoempresa = 2; // Ausente
          estadoModificado = true;
        }
      
        if (negocio.estadopersona === 5 && this.estadopersona !== 1) {
          this.estadopersona = 1; // En curso
        } else if (negocio.estadopersona === 4 && this.estadopersona !== 2) {
          this.estadopersona = 2; // Ausente
          estadoModificado = true;
        }
        if (estadoModificado) {
          this.fmodificarestados(negocio);
        }
      }
  
      else if (horaFin.getTime() <= horaActual.getTime()) {
        this.estadoempresa = 8; // Finalizado
        this.estadopersona = 8; // Finalizado
        this.fmodificarestados(negocio);
      }
      else {
        this.estadoempresa = 6; // Finalizado
        this.estadopersona = 6; 
        this.fmodificarestados(negocio);
      }
    });
  }

  fmodificarestados(negocio: Negocios){
    console.log({
      idnegocio: negocio.idnegocio,
      idpersona: negocio.persona.idpersona,
      estadoempresa: this.estadoempresa,
      estadopersona: this.estadopersona,
      mesa: negocio.mesa,
      tipo: negocio.tipo
    });
    this._tradesService.modificar({ idnegocio: negocio.idnegocio,
            idpersona: negocio.persona.idpersona,
            estadoempresa: this.estadoempresa,
            estadopersona: this.estadopersona,
            mesa: negocio.mesa,
            tipo: negocio.tipo,
      }).subscribe(data => {
        this.fdatos();
      });
  }
}
