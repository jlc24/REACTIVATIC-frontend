import { Component, OnInit } from '@angular/core';
import { Chart } from "angular-highcharts";
import { ReportesService } from 'src/app/_aods/reportes.service';
import { Graficos } from 'src/app/_entidades/graficos';
import { Reportes } from 'src/app/_entidades/reportes';

@Component({
  selector: 'app-clientesconmascompras',
  templateUrl: './clientesconmascompras.component.html',
  styleUrls: ['./clientesconmascompras.component.css']
})
export class ClientesconmascomprasComponent implements OnInit {

  chart1: Chart;
  series1: Array<Graficos> = [];

  datos: Reportes[];
  titulo:string = 'Clientes con mas compras';

  constructor(
    private _reportesService: ReportesService
  ) { }

  ngOnInit(): void {
    this.fdatos();
  }

  fdatos() {
    this._reportesService.clientesconmascompras().subscribe( data => {
      this.datos = data;
      this.fgraficos(this.datos);
    })
  }

  fgraficos(datos: Reportes[]){
    for (let index = 0; index < datos.length; index++) {
      let serie = new Graficos();
      serie.name = datos[index].entidad;
      serie.y = datos[index].cantidad;
      this.series1.push(serie);
    }
    this.chart1 = new Chart({
      chart: {
        type: 'pie',
        options3d: {
          enabled: true,
          alpha: 45,
          beta: 0
        }
      },
      title: {
        text: ''
      },
      subtitle: {
        text: 'Clientes con mas compras !!!'
      },
      credits: {
        enabled: false
      },
      exporting: {
        enabled: false
      },
      plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            depth: 35,
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            }
        }
      },
      series: [
        {
          name: 'Cantidad',
          type: 'pie',
          data: this.series1
        }
      ]
    });

  }

}
