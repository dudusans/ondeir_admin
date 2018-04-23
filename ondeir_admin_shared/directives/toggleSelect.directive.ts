import { Input, Directive, ElementRef, Renderer, OnInit, EventEmitter } from '@angular/core';

@Directive({
  selector: '[toggleSelect]'
})
export class ToggleSelectDirective implements OnInit {
  @Input('toggleSelect') toggleSelect: string;

  constructor(private hostElement: ElementRef, private renderer: Renderer) {}

  ngOnInit() {
//      const event = document.createEvent('MouseEvents');
      this.hostElement.nativeElement.onclick = () => {
        const myDropDown: HTMLSelectElement = document.getElementById(this.toggleSelect) as HTMLSelectElement;

        // this.renderer.invokeElementMethod(elemento, 'click', []);
        // elemento.querySelector('.ui-select-toggle').dispatchEvent(new Event('click'));

        const event = new MouseEvent('mousedown', {
          'view': window,
          'bubbles': true,
          'cancelable': true
        });

        myDropDown.dispatchEvent(event);
        };
  }

  showDropdown(element) {
    const event = new MouseEvent('mousedown', {
        'view': window,
        'bubbles': true,
        'cancelable': true
    });

    element.dispatchEvent(event);
  }
}
