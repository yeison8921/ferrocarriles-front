import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.css',
})
export class BannerComponent {
  nameImage?: string;
  constructor(private readonly router: Router) {
    this.nameImage =
      this.router.routerState.root.firstChild!.snapshot.routeConfig!.path;
  }
}
