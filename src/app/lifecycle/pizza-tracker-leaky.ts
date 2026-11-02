import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ServerCalls } from './server-calls';
import { PIZZA_STEPS } from './pizza-tracker';

// Same tracker as pizza-tracker.ts, but it forgets to clean up.
@Component({
  selector: 'app-pizza-tracker-leaky',
  template: `<p>Pizza: <b>{{ status }}</b></p>`,
})
export class PizzaTrackerLeaky implements OnInit, OnDestroy {
  private calls = inject(ServerCalls);
  private timerId?: ReturnType<typeof setInterval>;
  private step = 0;
  status = PIZZA_STEPS[0];

  ngOnInit() {
    // Ask the server for the pizza status every second
    this.timerId = setInterval(() => {
      this.calls.leaky.update((n) => n + 1);
      this.step = Math.min(this.step + 1, PIZZA_STEPS.length - 1);
      this.status = PIZZA_STEPS[this.step];
    }, 1000);
  }

  ngOnDestroy() {
    // Lab: the timer is still running. Stop it here.
  }
}
