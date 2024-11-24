import { Component } from '@angular/core';
import { Infobtn } from '../../interfaces/home';

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [],
  templateUrl: './info.component.html',
  styleUrl: './info.component.css',
})
export class InfoComponent {
  infobtn: Infobtn[] = [];
  urlSvg: string = '/assets/img/Home/infoHome/interes0';
  currentUrl: string | null = null;
  hover: string = '_hover.svg';
  disabledImg: string = '_deshabilitado.svg';

  constructor() {
    this.infobtn = [
      {
        id: 1,
        href: '/atencion-al-usuario/buzon-notificaciones-judiciales/43',
        url: this.urlSvg + '1.svg',
        state: 'undisabled',
      },
      {
        id: 2,
        href: '/informacion-al-ciudadano/boletin-virtual/17',
        url: this.urlSvg + '2.svg',
        state: 'undisabled',
      },
      {
        id: 3,
        href: '/informes/informes-consolidado-gestion-prestaciones-economicas/72',
        url: this.urlSvg + '3.svg',
        state: 'undisabled',
      },
      {
        id: 4,
        href: '/tramites-y-servicios/ventanilla-virtual/55',
        url: this.urlSvg + '4.svg',
        state: 'undisabled',
      },
      { id: 5, href: '', url: this.urlSvg + '5.svg', state: 'disabled' },
      {
        id: 6,
        href: '/tramites-y-servicios/tramites/54',
        url: this.urlSvg + '6.svg',
        state: 'undisabled',
      },
      {
        id: 7,
        href: 'https://www.urnadecristal.gov.co/',
        url: this.urlSvg + '7.svg',
        state: 'undisabled',
      },
      { id: 8, href: '/kids', url: this.urlSvg + '8.svg', state: 'undisabled' },
    ];
  }
}
