import { RegistrosComponent } from './registros/registros.component';
import { CatalogoComponent } from './catalogo/catalogo.component';
import { E404Component } from './e404/e404.component';
import { GuardianGuard } from './_guardias/guardian.guard';
import { PlantillaComponent } from './_plantillas/plantilla.component';
import { AccesoComponent } from './acceso/acceso.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetalleComponent } from './catalogo/detalle/detalle.component';
import { EmpresaComponent } from './catalogo/empresa/empresa.component';
import { PerfilComponent } from './catalogo/perfil/perfil.component';

const routes: Routes = [
  {
    path: 'acceso',
    component: AccesoComponent,
  },
  {
    path: 'catalogo',
    component: CatalogoComponent,
  },
  {
    path: 'catalogo/producto/:id',
    component: DetalleComponent,
  },
  {
    path: 'catalogo/empresa/:id',
    component: EmpresaComponent,
  },
  {
    path: 'catalogo/perfil/:id',
    component: PerfilComponent,
  },
  {
    path: '',
    component: PlantillaComponent,
    loadChildren: () =>
    import('./_modulos/modulos.module').then( (m) => m.ModulosModule),
    canActivate: [GuardianGuard],
    data: {
      rol: 'ROLE_TODOS'
    }
  },
  {
    path: '**',
    component: E404Component,
    canActivate: [GuardianGuard],
    data: {
      rol: 'ROLE_TODOS'
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true,
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
