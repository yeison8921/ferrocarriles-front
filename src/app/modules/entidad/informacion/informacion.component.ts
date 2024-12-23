import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { InformacionService } from './informacion.service';
import { Router } from '@angular/router';
import { AccordionComponent } from '../../../general/accordion/accordion.component';
import { DirectorioComponent } from '../../../general/directorio/directorio.component';
import Swal from 'sweetalert2';

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
    NgClass,
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

  buttons: any[] = [
    {
      class: 'col-lg-3',
      href: 'http://132.255.23.82/plantilla.asp?id=query_medico.asp',
      icon: 'fa-users',
      text: 'Consulta afiliados',
    },
    {
      class: 'col-lg-3',
      href: 'http://132.255.23.82/plantilla.asp?id=query_tramite.asp',
      icon: 'fa-cogs',
      text: 'Consulta de trámites',
    },
    {
      class: 'col-lg-3',
      href: 'http://132.255.23.82/plantilla.asp?id=query_certificado.asp',
      icon: 'fa-hand-holding-medical',
      text: 'Certificado de salud',
    },
    {
      class: 'col-lg-3',
      href: 'http://132.255.23.82/plantilla.asp?id=Estadistica.asp',
      icon: 'fa-chart-simple',
      text: 'Estadísticas',
    },
    {
      class: 'col-lg-3',
      href: 'https://www.cnsc.gov.co/index.php/convocatorias/en-desarrollo"',
      icon: 'fa-bullhorn',
      text: 'Convocatoria',
    },
    {
      class: 'col-lg-3',
      href: 'http://132.255.23.82/boletindepagoempl.asp',
      icon: 'fa-file-invoice',
      text: 'Recibos de pago',
    },
    {
      class: 'col-lg-3',
      href: 'http://132.255.23.82/boletindepago.asp',
      icon: 'fa-file-waveform',
      text: 'Recibos de pensión',
    },
    {
      class: 'col-lg-3',
      href: 'http://132.255.23.82/certificado_dianformtemp.asp',
      icon: 'fa-file-alt',
      text: 'Certificado de ingresos y retenciones',
    },
    {
      class: 'offset-lg-3 col-lg-3',
      href: 'http://132.255.23.82//wwwroot/default1.asp',
      icon: 'fa-users-line',
      text: 'Proveedores',
    },
    {
      class: 'col-lg-3',
      href: 'http://132.255.23.82/CUENTAS2.HTML',
      icon: 'fa-money-check-dollar',
      text: 'Cuentas de cobro',
    },
  ];

  constructor(
    private informacionService: InformacionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.showLoading();
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
        this.closeLoading();
      },
      error: (error) => {
        if (error.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('isAuthenticated');
          this.router.navigate(['/login']);
          this.closeLoading();
        }
      },
    });
  }

  showLoading() {
    Swal.fire({
      text: 'Espere un poco por favor.',
      imageUrl: 'assets/loading.gif',
      imageWidth: 70,
      imageHeight: 70,
      showConfirmButton: false,
      allowEscapeKey: false,
      allowOutsideClick: false,
    });
  }

  closeLoading() {
    Swal.close();
  }
}
