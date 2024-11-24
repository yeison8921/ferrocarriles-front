import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaginaComponent } from './pagina/pagina.component';
import { UsuarioComponent } from './usuario/usuario.component';

const routes: Routes = [
  {
    path: 'usuarios',
    title: 'Usuarios',
    component: UsuarioComponent,
  },
  {
    path: 'paginas',
    title: 'Página',
    component: PaginaComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministracionModule {}
