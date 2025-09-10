import { Component, ElementRef } from '@angular/core';
import { addClass, hasClass, removeClass } from './utils/toggle-class/dom';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(private elementRef: ElementRef) {
    this.elementRef = elementRef;
  }
  onAccordionHeaderClick(event: Event) {
    const target: HTMLElement = event.target as HTMLElement;
    const nextSibling = target.nextElementSibling as HTMLElement;
    if (hasClass('hidden', nextSibling)) {
      removeClass('hidden', nextSibling);
    } else {
      addClass('hidden', nextSibling);
    }
    return false;
  }
}
