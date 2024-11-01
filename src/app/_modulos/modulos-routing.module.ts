import { ProductosmasvendidosComponent } from './productosmasvendidos/productosmasvendidos.component';
import { ClientesconmascomprasComponent } from './clientesconmascompras/clientesconmascompras.component';
import { EmpresasmassolicitadasComponent } from './empresasmassolicitadas/empresasmassolicitadas.component';
import { ClientesregistradosComponent } from './clientesregistrados/clientesregistrados.component';
import { ReportesComponent } from './reportes/reportes.component';
import { SolicitudesventaComponent } from './solicitudesventa/solicitudesventa.component';
import { ProductosComponent } from './productos/productos.component';
import { RepresentantesComponent } from './representantes/representantes.component';
import { EmpresasComponent } from './empresas/empresas.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { AsociacionesComponent } from './asociaciones/asociaciones.component';
import { MunicipiosComponent } from './municipios/municipios.component';
import { RubrosComponent } from './rubros/rubros.component';
import { E401Component } from './e401/e401.component';
import { GuardianGuard } from './../_guardias/guardian.guard';
import { ConfiguracionesComponent } from './configuraciones/configuraciones.component';
import { PerfilesComponent } from './perfiles/perfiles.component';
import { EscritorioComponent } from './escritorio/escritorio.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SolicitudescompraComponent } from './solicitudescompra/solicitudescompra.component';
import { ClientesnoregistradosComponent } from './clientesnoregistrados/clientesnoregistrados.component';
import { RolesComponent } from './roles/roles.component';
import { BeneficiosComponent } from './beneficios/beneficios.component';
import { EnlacesComponent } from './enlaces/enlaces.component';
import { ExtensionesComponent } from './extensiones/extensiones.component';
import { GenerosComponent } from './generos/generos.component';
import { MaterialesComponent } from './materiales/materiales.component';
import { OfertasComponent } from './ofertas/ofertas.component';
import { PreciosComponent } from './precios/precios.component';
import { TamanosComponent } from './tamanos/tamanos.component';
import { CategoriaComponent } from './categoria/categoria.component';
import { CargosComponent } from './cargos/cargos.component';
import { ReporteunidadesComponent } from './reporteunidades/reporteunidades.component';
import { ReportebeneficiosComponent } from './reportebeneficios/reportebeneficios.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio',
  },
  {
    path: 'inicio',
    component: EscritorioComponent,
    canActivate: [GuardianGuard],
    data: {
      rol: 'ROLE_TODOS'
    }
  },
  {
    path: 'perfiles',
    component: PerfilesComponent,
    canActivate: [GuardianGuard],
    data: {
      rol: 'ROLE_TODOS'
    }
  },
  {
    path: 'configuraciones',
    component: ConfiguracionesComponent,
    canActivate: [GuardianGuard],
    data: {
      rol: 'ROLE_TODOS'
    }
  },
  {
    path: 'e401',
    component: E401Component,
    canActivate: [GuardianGuard],
    data: {
      rol: 'ROLE_TODOS'
    }
  },
  {
    path: 'usuarios',
    component: UsuariosComponent,
    canActivate: [GuardianGuard],
    data: {
      rol: 'ROLE_TODOS'
    }
  },
  {
    path: 'roles',
    component: RolesComponent,
    canActivate: [GuardianGuard],
    data: {
      rol: 'ROLE_TODOS'
    }
  },
  {
    path: 'cargos',
    component: CargosComponent,
    canActivate: [GuardianGuard],
    data: {
      rol: 'ROLE_TODOS'
    }
  },
  {
    path: 'categorias',
    component: CategoriaComponent,
    canActivate: [GuardianGuard],
    data: {
      rol: 'ROLE_TODOS'
    }
  },
  {
    path: 'enlaces',
    component: EnlacesComponent,
    canActivate: [GuardianGuard],
    data: {
      rol: 'ROLE_TODOS'
    }
  },
  {
    path: 'municipios',
    component: MunicipiosComponent,
    canActivate: [GuardianGuard],
    data: {
      rol: 'ROLE_TODOS'
    }
  },
  {
    path: 'rubros',
    component: RubrosComponent,
    canActivate: [GuardianGuard],
    data: {
      rol: 'ROLE_TODOS'
    }
  },
  {
    path: 'asociaciones',
    component: AsociacionesComponent,
    canActivate: [GuardianGuard],
    data: {
      rol: 'ROLE_TODOS'
    }
  },
  {
    path: 'representantes',
    component: RepresentantesComponent,
    canActivate: [GuardianGuard],
    data: {
      rol: 'ROLE_TODOS'
    }
  },
  {
    path: 'empresas',
    component: EmpresasComponent,
    canActivate: [GuardianGuard],
    data: {
      rol: 'ROLE_TODOS'
    }
  },
  {
    path: 'productos',
    component: ProductosComponent,
    canActivate: [GuardianGuard],
    data: {
      rol: 'ROLE_TODOS'
    }
  },
  {
    path: 'solicitudesventa',
    component: SolicitudesventaComponent,
    canActivate: [GuardianGuard],
    data: {
      rol: 'ROLE_TODOS'
    }
  },
  {
    path: 'beneficios',
    component: BeneficiosComponent,
    canActivate: [GuardianGuard],
    data: {
      rol: 'ROLE_TODOS'
    }
  },
  {
    path: 'reporteunidades',
    component: ReporteunidadesComponent,
    canActivate: [GuardianGuard],
    data: {
      rol: 'ROLE_TODOS'
    }
  },
  {
    path: 'reportebeneficios',
    component: ReportebeneficiosComponent,
    canActivate: [GuardianGuard],
    data: {
      rol: 'ROLE_TODOS'
    }
  },
  {
    path: 'solicitudescompra',
    component: SolicitudescompraComponent,
    canActivate: [GuardianGuard],
    data: {
      rol: 'ROLE_TODOS'
    }
  },
  {
    path: 'clientesnoregistrados',
    component: ClientesnoregistradosComponent,
    canActivate: [GuardianGuard],
    data: {
      rol: 'ROLE_TODOS'
    }
  },
  {
    path: 'clientes',
    component: ClientesregistradosComponent,
    canActivate: [GuardianGuard],
    data: {
      rol: 'ROLE_TODOS'
    }
  },
  {
    path: 'productosmasvendidos',
    component: ProductosmasvendidosComponent,
    canActivate: [GuardianGuard],
    data: {
      rol: 'ROLE_TODOS'
    }
  },
  {
    path: 'clientesconmascompras',
    component: ClientesconmascomprasComponent,
    canActivate: [GuardianGuard],
    data: {
      rol: 'ROLE_TODOS'
    }
  },
  {
    path: 'empresasmassolicitadas',
    component: EmpresasmassolicitadasComponent,
    canActivate: [GuardianGuard],
    data: {
      rol: 'ROLE_TODOS'
    }
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModulosRoutingModule {}
