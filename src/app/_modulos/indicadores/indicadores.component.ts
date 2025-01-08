import { Component, OnInit } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { ReportesService } from 'src/app/_aods/reportes.service';
import { Graficos } from 'src/app/_entidades/graficos';
import { Reportes } from 'src/app/_entidades/reportes';

@Component({
  selector: 'app-indicadores',
  templateUrl: './indicadores.component.html',
  styleUrls: ['./indicadores.component.css']
})
export class IndicadoresComponent implements OnInit {

  chart1: Chart;
  series1: Array<Graficos> = [];
  empresasgestion: Reportes[];

  chart2: Chart;
  series2: Array<Graficos> = [];
  empresasrubro: Reportes[];

  chart3: Chart;
  series3: Array<Graficos> = [];
  empresasmunicipio: Reportes[];

  gestiones: Reportes[];

  chart4: Chart[] = [];  // Array para almacenar los gráficos
  series4: Array<Graficos> = []; 
  empresasrubrogestion: Reportes[];

  chart5: Chart;
  series5: Array<Graficos> = [];
  empresasentienda: Reportes[];

  constructor(
    private _reportesService: ReportesService,
  ) { }

  ngOnInit(): void {
    this.fempresasgestion();
    this.fempresasrubro();
    this.fempresasmunicipio();
    this.fgestiones();
    this.fempresasentienda();
  }

  fempresasgestion(){
    this._reportesService.empresasporgestion().subscribe((data) => {
      this.empresasgestion = data;
      this.fgraficos1(this.empresasgestion);
    });
  }

  fempresasrubro(){
    this._reportesService.empresasporrubro().subscribe((data) => {
      this.empresasrubro = data;
      this.fgraficos2(this.empresasrubro);
    });
  }

  fempresasmunicipio(){
    this._reportesService.empresaspormunicipio().subscribe((data) => {
      this.empresasmunicipio = data;
      this.fgraficos3(this.empresasmunicipio);
    });
  }

  fgraficos1(datos: { entidad: string, cantidad: number }[]) {
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
          text: 'Gestiones'
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Cantidad de Unidades Productivas'
        }
      },
      plotOptions: {
        column: {
          depth: 25,
          colorByPoint: true,
          // enableMouseTracking: false,
          // allowPointSelect: false
        },
        series: {
          dataLabels: {
            enabled: true, // Mostrar siempre las etiquetas de los datos
            color: '#000',
            style: {
              fontSize: '15px',
              fontWeight: 'bold'
            }
          }
        }
      },
      series: [{
        name: 'Gestiones',
        type: 'column',
        data: this.series1,
        showInLegend: false
      }]
    });
  }

  fgraficos2(datos: { entidad: string, cantidad: number }[]) {
    for (let index = 0; index < datos.length; index++) {
      let serie = new Graficos();
      serie.name = datos[index].entidad;
      serie.y = datos[index].cantidad;
      this.series2.push(serie);
    }
    this.series2 = [];

    datos.forEach(dato => {
      let color = `#${Math.floor(Math.random()*16777215).toString(16)}`;
      let serie = { name: dato.entidad, y: dato.cantidad, color: color };
      this.series2.push(serie);
    });

    this.chart2 = new Chart({
      chart: {
        type: 'column'
      },
      title: {
        text: ''
      },
      xAxis: {
        categories: datos.map(d => d.entidad),
        title: {
          text: 'Rubros'
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Cantidad de Unidades Productivas'
        }
      },
      plotOptions: {
        column: {
          depth: 25,
          colorByPoint: true,
          // enableMouseTracking: false,
          // allowPointSelect: false
        },
        series: {
          dataLabels: {
            enabled: true, // Mostrar siempre las etiquetas de los datos
            color: '#000',
            style: {
              fontSize: '15px',
              fontWeight: 'bold'
            }
          }
        }
      },
      series: [{
        name: 'Rubros',
        type: 'column',
        data: this.series2,
        showInLegend: false
      }]
    });
  }

  fgraficos3(datos: { entidad: string, cantidad: number }[]) {
    for (let index = 0; index < datos.length; index++) {
      let serie = new Graficos();
      serie.name = datos[index].entidad;
      serie.y = datos[index].cantidad;
      this.series3.push(serie);
    }
    this.series3 = [];

    datos.forEach(dato => {
      let color = `#${Math.floor(Math.random()*16777215).toString(16)}`;
      let serie = { name: dato.entidad, y: dato.cantidad, color: color };
      this.series3.push(serie);
    });

    this.chart3 = new Chart({
      chart: {
        type: 'column'
      },
      title: {
        text: ''
      },
      xAxis: {
        categories: datos.map(d => d.entidad),
        title: {
          text: 'Municipios'
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Cantidad de Unidades Productivas'
        }
      },
      plotOptions: {
        column: {
          depth: 25,
          colorByPoint: true,
          // enableMouseTracking: false,
          // allowPointSelect: false
        },
        series: {
          dataLabels: {
            enabled: true, // Mostrar siempre las etiquetas de los datos
            color: '#000',
            style: {
              fontSize: '15px',
              fontWeight: 'bold'
            }
          }
        }
      },
      series: [{
        name: 'Municipios',
        type: 'column',
        data: this.series3,
        showInLegend: false
      }]
    });
  }

  fgestiones(){
    this._reportesService.gestion().subscribe(data =>{
      this.gestiones = data;
      this.gestiones.forEach(gestion => {
        this.fempresasrubrogestion(gestion.gestion);
      });
    })
  }

  fempresasrubrogestion(ano: number){
    this._reportesService.empresasporrubrogestion(ano).subscribe((data) => {
      this.empresasrubrogestion = data;
      this.fgraficos4(this.empresasrubrogestion, ano);
    });
  }

  fgraficos4(datos: { entidad: string, cantidad: number }[], ano: number) {
    let series = [];
    datos.forEach(dato => {
      let color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
      let serie = { name: dato.entidad, y: dato.cantidad, color: color };
      series.push(serie);
    });

    const nuevoGrafico = new Chart({
      chart: {
        type: 'column',
        renderTo: `chart-${ano}`  
      },
      title: {
        text: `Gráfico de Gestión ${ano}`  
      },
      xAxis: {
        categories: datos.map(d => d.entidad),
        title: {
          text: 'Rubros'
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Cantidad de Unidades Productivas'
        }
      },
      plotOptions: {
        column: {
          depth: 25,
          colorByPoint: true,
        },
        series: {
          dataLabels: {
            enabled: true, 
            color: '#000',
            style: {
              fontSize: '15px',
              fontWeight: 'bold'
            }
          }
        }
      },
      series: [{
        name: 'Rubros',
        type: 'column',
        data: series,
        showInLegend: false
      }]
    });

    this.chart4.push(nuevoGrafico);
  }

  fempresasentienda(){
    this._reportesService.empresasentienda().subscribe((data) => {
      this.empresasentienda = data;
      this.fgraficos5(this.empresasentienda);
    });
  }

  fgraficos5(datos: { entidad: string, cantidad: number }[]) {
    for (let index = 0; index < datos.length; index++) {
      let serie = new Graficos();
      serie.name = datos[index].entidad;
      serie.y = datos[index].cantidad;
      this.series5.push(serie);
    }
    this.series5 = [];

    datos.forEach(dato => {
      let color = `#${Math.floor(Math.random()*16777215).toString(16)}`;
      let serie = { name: dato.entidad, y: dato.cantidad, color: color };
      this.series5.push(serie);
    });

    this.chart5 = new Chart({
      chart: {
        type: 'column'
      },
      title: {
        text: ''
      },
      xAxis: {
        categories: datos.map(d => d.entidad),
        title: {
          text: 'Rubros'
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Cantidad de Unidades Productivas'
        }
      },
      plotOptions: {
        column: {
          depth: 25,
          colorByPoint: true,
          // enableMouseTracking: false,
          // allowPointSelect: false
        },
        series: {
          dataLabels: {
            enabled: true, // Mostrar siempre las etiquetas de los datos
            color: '#000',
            style: {
              fontSize: '15px',
              fontWeight: 'bold'
            }
          }
        }
      },
      series: [{
        name: 'Rubros',
        type: 'column',
        data: this.series5,
        showInLegend: false
      }]
    });
  }

}
