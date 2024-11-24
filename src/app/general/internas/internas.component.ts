import { Component } from '@angular/core';
import { BreadcrumbsComponent } from '../breadcrumbs/breadcrumbs.component';
import { RouterOutlet } from '@angular/router';
import { BannerComponent } from '../banner/banner.component';

@Component({
  selector: 'app-internas',
  standalone: true,
  imports: [
    BreadcrumbsComponent,
    RouterOutlet,
    BannerComponent,
  ],
  templateUrl: './internas.component.html',
  styleUrl: './internas.component.css',
})
export class InternasComponent {}
