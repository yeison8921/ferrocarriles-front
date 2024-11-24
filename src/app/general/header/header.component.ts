import { Component, HostListener, Input, Renderer2 } from '@angular/core';
import { MenuComponent } from './menu/menu.component';
import { TopbarComponent } from './topbar/topbar.component';
import { UserMenuComponent } from './user/user.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [TopbarComponent, MenuComponent, UserMenuComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  @Input() tipo!: string;

  constructor(private renderer: Renderer2) {}

  @HostListener('document:scroll', ['$event'])
  moveHeader(event: any) {
    let scroll = event.target.scrollingElement.scrollTop;
    let heightTopbar = document.getElementById('topbar')?.offsetHeight;
    let heightLogos = document.getElementById('logos')?.offsetHeight;
    if (scroll >= heightTopbar! + heightLogos!) {
      this.renderer.setStyle(
        document.getElementById('menu'),
        'position',
        'fixed'
      );
    }
    if (scroll < heightTopbar! + heightLogos!) {
      this.renderer.setStyle(
        document.getElementById('menu'),
        'position',
        'relative'
      );
    }
  }
}
