import { Component } from '@angular/core';
import { InternasComponent } from '../../general/internas/internas.component';

@Component({
  selector: 'app-entidad',
  standalone: true,
  imports: [InternasComponent],
  templateUrl: './entidad.component.html',
  styleUrl: './entidad.component.css',
})
export class EntidadComponent {}
