import { Component, inject, signal } from '@angular/core';
import { GreetingCard } from './greeting-card';
import { PizzaTracker } from './pizza-tracker';
import { PizzaTrackerLeaky } from './pizza-tracker-leaky';
import { ServerCalls } from './server-calls';

@Component({
  selector: 'app-lifecycle-page',
  imports: [GreetingCard, PizzaTracker, PizzaTrackerLeaky],
  providers: [ServerCalls],
  template: `
    <h1>1. Lifecycle hooks</h1>
    <p class="hook">Why is my &#64;Input undefined in the constructor, but fine in ngOnInit?</p>

    <div class="box">
      <h2>Demo 1: Where should I read my &#64;Input?</h2>
      <div class="expect"><b>Expect:</b> the card writes the same greeting in 3 different hooks. Only one of them is always right.</div>
      <ol class="steps">
        <li>Click <b>Show card</b>. Which line is wrong?</li>
        <li>Click <b>Change name</b>. Which line is wrong now?</li>
      </ol>
      <button (click)="showCard.set(!showCard())">{{ showCard() ? 'Hide card' : 'Show card' }}</button>
      <button (click)="changeName()" [disabled]="!showCard()">Change name</button>
      <span class="muted"> Parent is sending: <b>{{ name() }}</b></span>
      @if (showCard()) {
        <app-greeting-card [name]="name()" />
      }
      <details class="conclude">
        <summary>Conclusion (open after the demo)</summary>
        <p><b>constructor</b> is too early: inputs are not set yet. Use it only to inject services.</p>
        <p><b>ngOnInit</b> runs once, with the first input value. Good place to load data.</p>
        <p><b>ngOnChanges</b> runs every time an input changes. Use it to react to new values.</p>
      </details>
    </div>

    <div class="box">
      <h2>Demo 2: The zombie timer</h2>
      <div class="expect"><b>Expect:</b> both trackers ask the server for the pizza status every second. You close both. One of them keeps calling the server.</div>
      <ol class="steps">
        <li>Open both trackers. Watch both counters go up.</li>
        <li>Close both. Which counter keeps going?</li>
        <li>Open and close the red one 3 more times. How fast does it count now?</li>
      </ol>
      <div class="row">
        <div class="bad">
          <h3>Without cleanup in ngOnDestroy</h3>
          <button (click)="leakyOpen.set(!leakyOpen())">{{ leakyOpen() ? 'Close' : 'Open' }} tracker</button>
          <p>Server calls: <span class="big">{{ calls.leaky() }}</span></p>
          @if (leakyOpen()) { <app-pizza-tracker-leaky /> } @else { <p class="muted">Tracker is closed</p> }
        </div>
        <div class="good">
          <h3>With clearInterval in ngOnDestroy</h3>
          <button (click)="cleanOpen.set(!cleanOpen())">{{ cleanOpen() ? 'Close' : 'Open' }} tracker</button>
          <p>Server calls: <span class="big">{{ calls.clean() }}</span></p>
          @if (cleanOpen()) { <app-pizza-tracker /> } @else { <p class="muted">Tracker is closed</p> }
        </div>
      </div>
      <details class="conclude">
        <summary>Conclusion (open after the demo)</summary>
        <p>Closing a component does <b>not</b> stop the timers and subscriptions it started.</p>
        <p>Every open adds one more zombie: more server calls, more memory, a slower app.</p>
        <p>Rule: <b>whatever you start in ngOnInit, stop in ngOnDestroy.</b></p>
      </details>
    </div>
  `,
})
export default class LifecyclePage {
  calls = inject(ServerCalls);
  showCard = signal(false);
  leakyOpen = signal(false);
  cleanOpen = signal(false);
  name = signal('Asha');

  private names = ['Asha', 'Ravi', 'Meera'];

  changeName() {
    const next = (this.names.indexOf(this.name()) + 1) % this.names.length;
    this.name.set(this.names[next]);
  }
}
