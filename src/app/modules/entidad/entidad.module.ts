import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InformacionComponent } from './informacion/informacion.component';

const routes: Routes = [
  {
    path: 'informacion-general',
    title: 'Información general',
    component: InformacionComponent,
  },
  {
    path: 'institucionalidad',
    title: 'Institucionalidad',
    component: InformacionComponent,
  },
  {
    path: 'organigrama',
    title: 'Organigrama',
    component: InformacionComponent,
  },
  {
    path: 'politica-sistema-integrado-gestion',
    title: 'Política del Sistema Integrado de Gestión',
    component: InformacionComponent,
  },
  {
    path: 'objetivos-estrategicos',
    title: 'Objetivos estratégicos',
    component: InformacionComponent,
  },
  {
    path: 'funciones',
    title: 'Funciones',
    component: InformacionComponent,
  },
  {
    path: 'resoluciones',
    title: 'Resoluciones',
    component: InformacionComponent,
  },
  {
    path: 'decretos',
    title: 'Decretos',
    component: InformacionComponent,
  },
  {
    path: 'leyes',
    title: 'Leyes',
    component: InformacionComponent,
  },
  {
    path: 'anexos',
    title: 'Anexos',
    component: InformacionComponent,
  },
  {
    path: 'recursos',
    title: 'Recursos',
    component: InformacionComponent,
  },
  {
    path: 'sistema-integrado-gestion',
    title: 'Sistema integrado de gestión',
    component: InformacionComponent,
  },
  {
    path: 'directorio-telefonico',
    title: 'Directorio telefónico',
    component: InformacionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EntidadModule {}
