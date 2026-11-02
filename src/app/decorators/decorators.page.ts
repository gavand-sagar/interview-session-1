import { Component, signal } from '@angular/core';
import { CounterOld } from './counter-old';
import { CounterNew } from './counter-new';
import { LegacyModule } from './legacy.module';

@Component({
  selector: 'app-decorators-page',
  imports: [CounterOld, CounterNew, LegacyModule],
  template: `
    <h1>4. &#64;Input / &#64;Output decorators and NgModule</h1>
    <p class="hook">Most code you will maintain at your first job still looks like this.</p>

    <div class="box">
      <h2>Demo 1: Same counter, two styles</h2>
      <div class="expect"><b>Expect:</b> the old counter and the new counter behave exactly the same. The parent talks to both in the same way.</div>
      <ol class="steps">
        <li>Click <b>+1</b> on both. Watch "Last event".</li>
        <li>Set the start value to <b>10</b>. Both reset.</li>
        <li>Open <code>counter-old.ts</code> and <code>counter-new.ts</code> side by side.</li>
      </ol>
      <span>Start value: </span>
      <button (click)="start.set(0)" [class.on]="start() === 0">0</button>
      <button (click)="start.set(10)" [class.on]="start() === 10">10</button>
      <div class="row">
        <app-counter-old [start]="start()" (changed)="lastEvent.set('old counter: ' + $event)" />
        <app-counter-new [start]="start()" (changed)="lastEvent.set('new counter: ' + $event)" />
      </div>
      <p>Last event: <b>{{ lastEvent() }}</b></p>
      <details class="conclude">
        <summary>Conclusion (open after the demo)</summary>
        <p><code>&#64;Input()</code> became <code>input()</code>. <code>&#64;Output()</code> + EventEmitter became <code>output()</code>. ngOnChanges became <code>linkedSignal</code> / <code>computed</code>.</p>
        <p>The parent does not care: <code>[start]</code> and <code>(changed)</code> look the same for both.</p>
      </details>
    </div>

    <div class="box">
      <h2>Demo 2: Life inside an NgModule</h2>
      <div class="expect"><b>Expect:</b> this greeting is not standalone. It only works because its module gives it what it needs.</div>
      <ol class="steps">
        <li>Open <code>legacy.module.ts</code>. Find declarations, imports, exports.</li>
        <li>Remove <code>CommonModule</code> from imports and save. Does the build fail? What happens to the greeting? Check the console.</li>
        <li>Put it back.</li>
      </ol>
      <div class="good"><app-legacy-greeting name="Asha" /></div>
      <pre>{{ moduleCode }}</pre>
      <details class="conclude">
        <summary>Conclusion (open after the demo)</summary>
        <p>In an NgModule, components get their tools (ngIf, ngFor, pipes) from the <b>module's imports</b>, not their own.</p>
        <p>Forget CommonModule and the build still passes, but the greeting silently disappears. The only clue is error NG0303 in the console: "Can't bind to 'ngIf'".</p>
        <p>Standalone components list their own imports, and the compiler warns you at build time.</p>
      </details>
    </div>
  `,
})
export default class DecoratorsPage {
  start = signal(0);
  lastEvent = signal('none yet');

  moduleCode = `@NgModule({
  declarations: [LegacyGreeting],   // components that belong here
  imports: [CommonModule],          // what they need
  exports: [LegacyGreeting],        // what others may use
})
export class LegacyModule {}`;
}
