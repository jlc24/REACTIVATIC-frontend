import { Component, OnInit } from '@angular/core';
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

  constructor(
    private _beneficiosService: BeneficiosService,
    private _tradesService: TradesService,
  ) { }

  ngOnInit(): void {
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
    });
  }

}
