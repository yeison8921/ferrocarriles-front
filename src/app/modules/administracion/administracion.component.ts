import { Component } from '@angular/core';
import { InternasComponent } from '../../general/internas/internas.component';

@Component({
  selector: 'app-administracion',
  standalone: true,
  imports: [InternasComponent],
  templateUrl: './administracion.component.html',
  styleUrl: './administracion.component.css',
})
export class AdministracionComponent {}
