import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ArtefactosModule } from './../_artefactos/artefactos.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModulosRoutingModule } from './modulos-routing.module';
import { EscritorioComponent } from './escritorio/escritorio.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { PerfilesComponent } from './perfiles/perfiles.component';
import { ConfiguracionesComponent } from './configuraciones/configuraciones.component';
import { E401Component } from './e401/e401.component';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { RubrosComponent } from './rubros/rubros.component';
import { MunicipiosComponent } from './municipios/municipios.component';
import { LocalidadesComponent } from './localidades/localidades.component';
import { SubrubrosComponent } from './subrubros/subrubros.component';
import { AsociacionesComponent } from './asociaciones/asociaciones.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { EmpresasComponent } from './empresas/empresas.component';
import { RepresentantesComponent } from './representantes/representantes.component';
import { ProductosComponent } from './productos/productos.component';
import { SolicitudesventaComponent } from './solicitudesventa/solicitudesventa.component';
import { SolicitudescompraComponent } from './solicitudescompra/solicitudescompra.component';
import { ReportesComponent } from './reportes/reportes.component';
import { SeguimientosComponent } from './seguimientos/seguimientos.component';
import { ClientesnoregistradosComponent } from './clientesnoregistrados/clientesnoregistrados.component';
import { ClientesregistradosComponent } from './clientesregistrados/clientesregistrados.component';
import { ProductosmasvendidosComponent } from './productosmasvendidos/productosmasvendidos.component';
import { ClientesconmascomprasComponent } from './clientesconmascompras/clientesconmascompras.component';
import { EmpresasmassolicitadasComponent } from './empresasmassolicitadas/empresasmassolicitadas.component';
import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
import * as highmaps from 'highcharts/modules/map.src';
import { CategoriaComponent } from './categoria/categoria.component';
import { BeneficiosComponent } from './beneficios/beneficios.component';
import { ColoresComponent } from './colores/colores.component';
import { ComentariosComponent } from './comentarios/comentarios.component';
import { MaterialesComponent } from './materiales/materiales.component';
import { OfertasComponent } from './ofertas/ofertas.component';
import { PreciosComponent } from './precios/precios.component';
import { TamanosComponent } from './tamanos/tamanos.component';
import { DocumentosComponent } from './documentos/documentos.component';
import { EnlacesComponent } from './enlaces/enlaces.component';
import { ExtensionesComponent } from './extensiones/extensiones.component';
import { GenerosComponent } from './generos/generos.component';
import { RolesComponent } from './roles/roles.component';
import { CargosComponent } from './cargos/cargos.component';
import { ReporteunidadesComponent } from './reporteunidades/reporteunidades.component';
import { ReportebeneficiosComponent } from './reportebeneficios/reportebeneficios.component';
import { NegociosComponent } from './negocios/negocios.component';




@NgModule({
  declarations: [EscritorioComponent, PerfilesComponent, ConfiguracionesComponent, E401Component, RubrosComponent, MunicipiosComponent, LocalidadesComponent, SubrubrosComponent, AsociacionesComponent, UsuariosComponent, EmpresasComponent, RepresentantesComponent, ProductosComponent, SolicitudesventaComponent, SolicitudescompraComponent, ReportesComponent, SeguimientosComponent, ClientesnoregistradosComponent, ClientesregistradosComponent, ProductosmasvendidosComponent, ClientesconmascomprasComponent, EmpresasmassolicitadasComponent, CategoriaComponent, BeneficiosComponent, ColoresComponent, ComentariosComponent, MaterialesComponent, OfertasComponent, PreciosComponent, TamanosComponent, DocumentosComponent, EnlacesComponent, ExtensionesComponent, GenerosComponent, RolesComponent, CargosComponent, ReporteunidadesComponent, ReportebeneficiosComponent, NegociosComponent],
  imports: [
    CommonModule,
    ModulosRoutingModule,
    ArtefactosModule,
    CKEditorModule,
    NgbPaginationModule,
    ReactiveFormsModule,
    FormsModule,
    ChartModule
  ]
})
export class ModulosModule { }
