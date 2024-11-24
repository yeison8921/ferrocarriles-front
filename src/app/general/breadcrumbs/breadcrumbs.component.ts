import { NgIf, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [NgIf],
  templateUrl: './breadcrumbs.component.html',
  styleUrl: './breadcrumbs.component.css',
})
export class BreadcrumbsComponent implements OnInit {
  padre?: any;
  titulo?: string;
  constructor(
    private readonly title: Title,
    private readonly router: Router,
    private location: Location
  ) {
    let path =
      this.router.routerState.root.firstChild!.snapshot.routeConfig!.data![
        'path'
      ];
    this.padre = {
      nombre:
        this.router.routerState.root.firstChild!.snapshot.routeConfig!.title,
      url:
        path == ''
          ? this.router.routerState.root.firstChild!.snapshot.routeConfig!.path
          : path,
      page: this.router.routerState.root.firstChild!.snapshot.routeConfig!
        .data!['page'],
    };
  }
  ngOnInit() {
    this.titulo = this.title.getTitle();

    let path = this.location.path().split('/');
    if (path[path.length - 1] == '53') {
      this.padre.nombre = this.titulo;
    }
  }
}
