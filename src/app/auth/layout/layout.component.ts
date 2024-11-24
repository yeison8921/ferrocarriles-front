import { Component } from '@angular/core';
import { LoginComponent } from '../login/login.component';


@Component({
  selector: 'app-layout-login',
  standalone: true,
  imports: [
    LoginComponent
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutLoginComponent {

}
