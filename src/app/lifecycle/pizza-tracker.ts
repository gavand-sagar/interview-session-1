import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ServerCalls } from './server-calls';

export const PIZZA_STEPS = ['Order placed', 'Making the dough', 'In the oven', 'On the way', 'Delivered'];

@Component({
  selector: 'app-pizza-tracker',
  template: `<p>Pizza: <b>{{ status }}</b></p>`,
})
export class PizzaTracker implements OnInit, OnDestroy {
  private calls = inject(ServerCalls);
  private timerId?: ReturnType<typeof setInterval>;
  private step = 0;
  status = PIZZA_STEPS[0];

  ngOnInit() {
    // Ask the server for the pizza status every second
    this.timerId = setInterval(() => {
      this.calls.clean.update((n) => n + 1);
      this.step = Math.min(this.step + 1, PIZZA_STEPS.length - 1);
      this.status = PIZZA_STEPS[this.step];
    }, 1000);
  }

  ngOnDestroy() {
    clearInterval(this.timerId);
  }
}
