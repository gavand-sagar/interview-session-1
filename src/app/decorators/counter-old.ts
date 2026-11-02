import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

// The style you will see in most existing projects.
@Component({
  selector: 'app-counter-old',
  template: `
    <div class="box">
      <b>Old style</b>
      <p class="big">{{ count }}</p>
      <button (click)="increment()">+1</button>
    </div>
  `,
})
export class CounterOld implements OnChanges {
  @Input() start = 0;
  @Output() changed = new EventEmitter<number>();

  count = 0;

  // When the parent sends a new start value, reset the count
  ngOnChanges() {
    this.count = this.start;
  }

  increment() {
    this.count++;
    this.changed.emit(this.count);
  }
}
