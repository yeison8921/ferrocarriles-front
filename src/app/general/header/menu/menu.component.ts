import { Component } from '@angular/core';
import {
  NgbCollapseModule,
  NgbDropdownModule,
} from '@ng-bootstrap/ng-bootstrap';
import { NgClass, NgFor, NgIf, Location } from '@angular/common';
import { Menu } from '../../../interfaces/header';
import { SearchComponent } from '../search/search.component';
import { AuthService } from '../../../auth/login/auth.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    NgbCollapseModule,
    NgbDropdownModule,
    NgClass,
    NgFor,
    NgIf,
    SearchComponent,
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent {
  isCollapsed = true;
  menu: Menu[] = [];
  role: number = 0;

  ngOnInit() {
    this.authService.getRolByToken().subscribe({
      next: (data) => {
        this.role = data.rol;
        this.menu = [
          {
            id: 1,
            nombre: 'Entidad',
            url: '/#',
            active: false,
            submenu: [
              {
                id: 1,
                nombre: 'Informacion',
                url: '/entidad/informacion-general',
                active: false,
              },
              {
                id: 2,
                nombre: 'Institucionalidad',
                url: '/entidad/institucionalidad',
                active: false,
              },
              {
                id: 3,
                nombre: 'Organigrama',
                url: '/entidad/organigrama',
                active: false,
              },
              {
                id: 4,
                nombre: 'Política del Sistema Integrado de Gestión',
                url: '/entidad/politica-sistema-integrado-gestion',
                active: false,
              },
              {
                id: 5,
                nombre: 'Objetivos estratégicos',
                url: '/entidad/objetivos-estrategicos',
                active: false,
              },
              {
                id: 6,
                nombre: 'Funciones',
                url: '/entidad/funciones',
                active: false,
              },
              {
                id: 7,
                nombre: 'Resoluciones',
                url: '/entidad/resoluciones',
                active: false,
              },
              {
                id: 8,
                nombre: 'Decretos',
                url: '/entidad/decretos',
                active: false,
              },
              {
                id: 9,
                nombre: 'Leyes',
                url: '/entidad/leyes',
                active: false,
              },
              {
                id: 10,
                nombre: 'Anexos',
                url: '/entidad/anexos',
                active: false,
              },
            ],
          },
          {
            id: 2,
            nombre: 'Recursos',
            url: '/entidad/recursos',
            active: false,
            submenu: [],
            
          },
          {
            id: 3,
            nombre: 'Sistema integrado de gestión',
            url: '/entidad/sistema-integrado-gestion',
            active: false,
            submenu: [],
          },
          {
            id: 4,
            nombre: 'Directorio telefónico',
            url: '/entidad/directorio-telefonico',
            active: false,
            submenu: [],
          },
          {
            id: 5,
            nombre: 'Administración',
            url: '#',
            active: false,
            submenu: [
              {
                id: 1,
                nombre: 'Usuarios',
                url: '/administracion/usuarios',
                active: false,
              },
              {
                id: 2,
                nombre: 'Páginas',
                url: '/administracion/paginas',
                active: false,
              },
            ],
          },
        ];

        if (this.role !== 1) {
          this.menu = this.menu.filter(
            (item) => item.nombre !== 'Administración'
          );
        }

        let path = this.location.path().split('/');
        this.activarMenu(path[path.length - 1]);
      },
      error: (error) => {
        console.error('Error fetching user data:', error);
      },
    });
  }

  constructor(private location: Location, private authService: AuthService) {}

  activarMenu(numberPath: string) {
    this.menu.forEach((item) => {
      item.active = false;
      let numberUrl = item.url.split('/')[item.url.split('/').length - 1];
      if (item.submenu!.length > 0) {
        item.submenu!.forEach((submenu) => {
          submenu.active = false;
          let numberSurl =
            submenu.url.split('/')[submenu.url.split('/').length - 1];
          if (numberSurl == numberPath) {
            submenu.active = true;
          }
        });
      } else {
        if (numberUrl == numberPath) {
          item.active = true;
        }
      }
    });
  }
}
