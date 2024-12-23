import { Component, OnInit, OnDestroy } from '@angular/core';
import { RUTA } from '../_config/application';
import { Beneficios } from '../_entidades/beneficios';
import { Negocios } from '../_entidades/negocios';
import { BeneficiosService } from '../_aods/beneficios.service';
import { TradesService } from '../_aods/trades.service';
import { NegociosService } from '../_aods/negocios.service';

@Component({
  selector: 'app-trade',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.css']
})
export class TradeComponent implements OnInit {

  ruta = `${RUTA}/catalogos/descargarempresa/`;

  beneficio: Beneficios;
  negocios: Negocios[];
  negocio: Negocios;

  buscarnegocios: string = '';

  totalcitas: number = 0;

  isSameDate: boolean = false;

  gestion: number = new Date().getFullYear();

  horaActual: string = '';
  private intervalId: any;

  constructor(
    private _negociosService: NegociosService,
  ) { }

  ngOnInit(): void {
    this.fnegocios();
    this.actualizarHora();
    this.intervalId = setInterval(() => this.actualizarHora(), 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  actualizarHora(): void {
    const ahora = new Date();
    this.horaActual = ahora.toLocaleTimeString();
    this.fnegocios();
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
    this._negociosService.negocios().subscribe((data) => {
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
    this._negociosService.cantidad(this.buscarnegocios, this.beneficio.idbeneficio).subscribe(data => {
      this.totalcitas = data;
    });
  }

  fdatos(){
    this._negociosService.datos(this.buscarnegocios, this.beneficio.idbeneficio).subscribe(data => {
      this.negocios = data;
      this.fcantidad();
    });
  }

}
