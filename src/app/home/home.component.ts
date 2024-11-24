import { Component } from '@angular/core';
import { InfoComponent } from './info/info.component';
import { SliderComponent } from './slider/slider.component';
import { MultimediaComponent } from './multimedia/multimedia.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    InfoComponent,
    SliderComponent,
    MultimediaComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
