import { NgFor } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import {
  NgbCarousel,
  NgbCarouselModule,
  NgbSlideEvent,
  NgbSlideEventSource,
} from '@ng-bootstrap/ng-bootstrap';
import { Slider } from '../../interfaces/home';

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [NgbCarouselModule, NgFor],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.css',
})
export class SliderComponent {
  slider: Slider[] | undefined;
  paused = false;
  unpauseOnArrow = false;
  pauseOnIndicator = false;
  pauseOnHover = true;
  pauseOnFocus = true;

  @ViewChild('carousel', { static: true }) carousel: NgbCarousel | undefined;

  constructor() {
    this.slider = [
      {
        id: 1,
        imagen: '/assets/img/Home/sliderHome/145.jpg',
        url: '',
      },
      {
        id: 3,
        imagen: '/assets/img/Home/sliderHome/146.jpg',
        url: '',
      },
    ];
  }

  togglePaused() {
    if (this.paused) {
      this.carousel?.cycle();
    } else {
      this.carousel?.pause();
    }
    this.paused = !this.paused;
  }

  onSlide(slideEvent: NgbSlideEvent) {
    if (
      this.unpauseOnArrow &&
      slideEvent.paused &&
      (slideEvent.source === NgbSlideEventSource.ARROW_LEFT ||
        slideEvent.source === NgbSlideEventSource.ARROW_RIGHT)
    ) {
      this.togglePaused();
    }
    if (
      this.pauseOnIndicator &&
      !slideEvent.paused &&
      slideEvent.source === NgbSlideEventSource.INDICATOR
    ) {
      this.togglePaused();
    }
  }
}
