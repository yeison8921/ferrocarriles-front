import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class IsSignedInGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated) {
      this.router.navigate(['/entidad/informacion-general']); // or home
      return false;
    }
    return true;
  }
}
