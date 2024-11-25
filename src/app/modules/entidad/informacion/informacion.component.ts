import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { InformacionService } from './informacion.service';
import { Router } from '@angular/router';
import { AccordionComponent } from '../../../general/accordion/accordion.component';
import { DirectorioComponent } from '../../../general/directorio/directorio.component';

interface SectionData {
  'informacion-general': number;
  institucionalidad: number;
  organigrama: number;
  'politica-sistema-integrado-gestion': number;
  'objetivos-estrategicos': number;
  funciones: number;
  resoluciones: number;
  decretos: number;
  leyes: number;
  anexos: number;
  recursos: number;
  'sistema-integrado-gestion': number;
  'directorio-telefonico': number;
}

@Component({
  selector: 'app-informacion',
  standalone: true,
  imports: [
    NgbAccordionModule,
    NgFor,
    NgIf,
    AccordionComponent,
    DirectorioComponent,
  ],
  templateUrl: './informacion.component.html',
  styleUrl: './informacion.component.css',
})
export class InformacionComponent implements OnInit {
  title: string = '';
  content: string = '';
  categories: any[] = [];
  sections: any[] = [];
  areas: any[] = [];
  sectionId: number = 0;
  section: keyof SectionData | '' = '';
  json: SectionData = {
    'informacion-general': 1,
    institucionalidad: 2,
    organigrama: 3,
    'politica-sistema-integrado-gestion': 4,
    'objetivos-estrategicos': 5,
    funciones: 6,
    resoluciones: 7,
    decretos: 8,
    leyes: 9,
    anexos: 10,
    recursos: 11,
    'sistema-integrado-gestion': 12,
    'directorio-telefonico': 13,
  };

  constructor(
    private informacionService: InformacionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.section = this.router.url.split('/')[2] as keyof SectionData;

    this.sectionId = parseInt(this.json[this.section].toString(), 10);

    this.informacionService.getPaginas(this.json[this.section]).subscribe({
      next: (data) => {
        this.title = data.nombre;
        this.content = data.contenido;
        if (this.sectionId >= 7 || this.sectionId <= 12) {
          this.sections = data.secciones;
        }
        if (this.sectionId == 13) {
          this.areas = data.directorios[0].areas;
        }
      },
      error: (error) => {
        if (error.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('isAuthenticated');
          this.router.navigate(['/login']);
        }
      },
    });
  }
}
