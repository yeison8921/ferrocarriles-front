import { RouterModule, Routes } from '@angular/router';
import { EntidadComponent } from './modules/entidad/entidad.component';
import { LoginComponent } from './auth/login/login.component';
import { LayoutLoginComponent } from './auth/layout/layout.component';
import { AuthGuard } from './auth.guard';
import { AdministracionComponent } from './modules/administracion/administracion.component';

export let routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: LayoutLoginComponent,
  },
  {
    path: 'entidad',
    component: EntidadComponent,
    canActivate: [AuthGuard],
    title: 'Entidad',
    data: {
      page: true,
      path: 'entidad',
    },
    loadChildren: () =>
      import('./modules/entidad/entidad.module').then((m) => m.EntidadModule),
  },
  {
    path: 'administracion',
    component: AdministracionComponent,
    canActivate: [AuthGuard],
    title: 'Administración',
    data: {
      page: true,
      path: 'administracion',
    },
    loadChildren: () =>
      import('./modules/administracion/administracion.module').then(
        (m) => m.AdministracionModule
      ),
  },
];
export let AppRouterModule = RouterModule.forRoot(routes, {});
