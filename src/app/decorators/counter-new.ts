import { Component, input, linkedSignal, output } from '@angular/core';

// The same counter in today's style.
@Component({
  selector: 'app-counter-new',
  template: `
    <div class="box">
      <b>New style</b>
      <p class="big">{{ count() }}</p>
      <button (click)="increment()">+1</button>
    </div>
  `,
})
export class CounterNew {
  start = input(0);
  changed = output<number>();

  // Starts from `start`, and resets whenever `start` changes (no ngOnChanges needed)
  count = linkedSignal(() => this.start());

  increment() {
    this.count.update((c) => c + 1);
    this.changed.emit(this.count());
  }
}
