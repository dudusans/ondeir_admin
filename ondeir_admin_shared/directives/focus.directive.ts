import { Directive, OnInit, Input, ElementRef, Renderer, EventEmitter } from '@angular/core';

@Directive({
  selector: '[isFocused]'
})
export class FocusDirective implements OnInit {

  @Input('isFocused') focusEvent: EventEmitter<boolean>;

  constructor(private hostElement: ElementRef, private renderer: Renderer) {}

  ngOnInit() {
    this.focusEvent.subscribe(event => {
      this.renderer.invokeElementMethod(this.hostElement.nativeElement, 'focus', []);
    });
  }
}
