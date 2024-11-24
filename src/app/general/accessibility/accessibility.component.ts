import { Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-accessibility',
  standalone: true,
  imports: [],
  templateUrl: './accessibility.component.html',
  styleUrl: './accessibility.component.css',
})
export class AccessibilityComponent implements OnInit {
  class: string[];
  contrast_on: boolean;
  classIndex: number;
  private domElement: HTMLElement;

  constructor(private renderer: Renderer2, private elementRef: ElementRef) {
    this.class = [
      'f-0',
      'f-1',
      'f-2',
      'f-3',
      'f-4',
      'f-5',
      'f-6',
      'f-7',
      'f-8',
      'f-9',
      'f-10',
    ];
    this.contrast_on = false;
    this.classIndex = 5;
    this.domElement = this.elementRef.nativeElement as HTMLElement;
  }
  @Input() minHeight?: number;
  @Input('app-root') topOffset?: number;

  ngOnInit(): void {}

  cambiarContexto() {
    var htmlElement = document.documentElement;
    if (this.contrast_on) {
      htmlElement.classList.remove('hight-contrast');
      this.contrast_on = false;
    } else {
      htmlElement.classList.add('hight-contrast');
      this.contrast_on = true;
    }
  }

  disminuirTamanio() {
    var previousClass = this.classIndex;
    this.classIndex--;
    this.classIndex = this.classIndex < 0 ? 0 : this.classIndex;
    this.changeClass(previousClass, this.classIndex);
  }

  aumentarTamanio() {
    var previousClass = this.classIndex;
    this.classIndex++;
    this.classIndex =
      this.classIndex === this.class.length
        ? this.class.length - 1
        : this.classIndex;
    this.changeClass(previousClass, this.classIndex);
  }

  changeClass(previous: number, next: number) {
    if (previous !== next) {
      var htmlElement = document.documentElement;
      htmlElement.classList.remove(this.class[previous]);
      htmlElement.classList.add(this.class[next]);
    }
  }
}
