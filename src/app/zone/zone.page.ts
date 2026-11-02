import { AfterViewInit, Component, DoCheck, ElementRef, NgZone, inject, viewChild } from '@angular/core';
import { CartBadge } from './cart-badge';

@Component({
  selector: 'app-zone-page',
  imports: [CartBadge],
  template: `
    <h1>2. zone.js, NgZone and OnPush</h1>
    <p class="hook">Who tells Angular to update the screen? And what if it updates too often?</p>

    <div class="box">
      <h2>Demo 1: Who updates the screen?</h2>
      <div class="expect"><b>Expect:</b> both pizzas are ready after 2 seconds. Only one screen says so.</div>
      <ol class="steps">
        <li>Green side: click <b>Order pizza</b>. Wait 2 seconds.</li>
        <li>Red side: click <b>Order pizza</b>. Wait 5 seconds. Stuck on "Cooking..."?</li>
        <li>Click <b>Poke the screen</b>. It does nothing at all. Watch the red status.</li>
      </ol>
      <div class="row">
        <div class="bad">
          <h3>Without zone.js</h3>
          <button (click)="orderWithout()">Order pizza</button>
          <button (click)="poke()">Poke the screen</button>
          <p>Status: <span class="big">{{ pizzaWithout }}</span></p>
          <p class="muted">The setTimeout runs outside zone.js, like an app with no zone.js.</p>
        </div>
        <div class="good">
          <h3>With zone.js</h3>
          <button (click)="orderWith()">Order pizza</button>
          <p>Status: <span class="big">{{ pizzaWith }}</span></p>
          <p class="muted">A normal setTimeout.</p>
        </div>
      </div>
      <details class="conclude">
        <summary>Conclusion (open after the demo)</summary>
        <p>The data was "Ready!" all along. Only the <b>screen</b> was old.</p>
        <p><b>zone.js</b> notices every click, setTimeout and HTTP response, and tells Angular "check the screen now".</p>
        <p>New Angular apps are zoneless: signals tell Angular what changed instead.</p>
      </details>
    </div>

    <div class="box">
      <h2>Demo 2: Too many checks</h2>
      <div class="expect"><b>Expect:</b> both boxes do the same job: show which half the mouse is on. One costs hundreds of checks, the other only a few.</div>
      <ol class="steps">
        <li>Click <b>Reset</b>. Shake the mouse in the red box for 3 seconds. Look at the number.</li>
        <li>Click <b>Reset</b>. Shake the mouse in the green box for 3 seconds. Look at the number.</li>
      </ol>
      <p>Angular checked the page <span class="big">{{ checks }}</span> times <button (click)="checks = 0">Reset</button></p>
      <div class="row">
        <div class="bad">
          <h3>Normal (mousemove)</h3>
          <div class="area" (mousemove)="onMoveInside($event)">{{ halfInside }}</div>
          <p class="muted">Every mouse move = one check.</p>
        </div>
        <div class="good">
          <h3>runOutsideAngular</h3>
          <div class="area" #outsideArea>{{ halfOutside }}</div>
          <p class="muted">Moves are ignored. zone.run() only when the half changes.</p>
        </div>
      </div>
      <details class="conclude">
        <summary>Conclusion (open after the demo)</summary>
        <p>zone.js checks after <b>every</b> event, even when nothing on screen changes.</p>
        <p>For noisy events (scroll, mousemove, resize, fast timers) use <b>runOutsideAngular</b>, then <b>zone.run</b> only when the screen really needs an update.</p>
        <p>Real examples: "Back to top" button on scroll, sticky header, drag and drop, charts.</p>
      </details>
    </div>

    <div class="box">
      <h2>Demo 3: The cart icon that lies (OnPush)</h2>
      <div class="expect"><b>Expect:</b> both carts get a pizza on every click. One cart icon stops counting.</div>
      <ol class="steps">
        <li>Click <b>Add pizza</b> on both sides 2 times. Compare "Parent has" and "Cart icon".</li>
        <li>On the red side, click <b>markForCheck()</b>.</li>
      </ol>
      <div class="row">
        <div class="bad">
          <h3>cart.push(item)</h3>
          <p>Parent has {{ cartPush.length }} items</p>
          <app-cart-badge #pushBadge [items]="cartPush" />
          <button (click)="addWithPush()">Add pizza</button>
          <button (click)="pushBadge.refresh()">markForCheck()</button>
        </div>
        <div class="good">
          <h3>cart = [...cart, item]</h3>
          <p>Parent has {{ cartNew.length }} items</p>
          <app-cart-badge [items]="cartNew" />
          <button (click)="addWithNewArray()">Add pizza</button>
        </div>
      </div>
      <details class="conclude">
        <summary>Conclusion (open after the demo)</summary>
        <p><b>OnPush</b> only re-checks when the input <b>reference</b> changes. push() changes the same array, so the icon never hears about it.</p>
        <p>markForCheck() is a rescue. The real fix: <b>don't mutate, create a new array or object.</b></p>
      </details>
    </div>
  `,
})
export default class ZonePage implements DoCheck, AfterViewInit {
  private zone = inject(NgZone);
  private outsideArea = viewChild.required<ElementRef<HTMLElement>>('outsideArea');

  checks = 0;
  pizzaWithout = 'Hungry';
  pizzaWith = 'Hungry';
  halfInside = 'Shake the mouse here';
  halfOutside = 'Shake the mouse here';
  cartPush = ['Burger'];
  cartNew = ['Burger'];

  ngDoCheck() {
    this.checks++;
  }

  orderWithout() {
    this.pizzaWithout = 'Cooking...';
    this.zone.runOutsideAngular(() => {
      setTimeout(() => (this.pizzaWithout = 'Ready!'), 2000);
    });
  }

  orderWith() {
    this.pizzaWith = 'Cooking...';
    setTimeout(() => (this.pizzaWith = 'Ready!'), 2000);
  }

  poke() {
    // Does nothing. But it is a click, so zone.js runs change detection.
  }

  onMoveInside(event: MouseEvent) {
    this.halfInside = this.whichHalf(event);
  }

  ngAfterViewInit() {
    const area = this.outsideArea().nativeElement;
    // This listener lives outside Angular, so mouse moves do not run change detection.
    this.zone.runOutsideAngular(() => {
      area.addEventListener('mousemove', (event) => {
        const half = this.whichHalf(event);
        if (half !== this.halfOutside) {
          this.zone.run(() => (this.halfOutside = half)); // back inside Angular, only when needed
        }
      });
    });
  }

  addWithPush() {
    this.cartPush.push('Pizza');
  }

  addWithNewArray() {
    this.cartNew = [...this.cartNew, 'Pizza'];
  }

  private whichHalf(event: MouseEvent) {
    const box = (event.currentTarget as HTMLElement).getBoundingClientRect();
    return event.clientX - box.left < box.width / 2 ? 'LEFT half' : 'RIGHT half';
  }
}
