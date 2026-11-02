# Session: Lifecycle, Change Detection and Classic Angular

Second last session (2 hours). Four topics that come up in almost every Angular interview.

```bash
npm install
npm start
```

Open http://localhost:4200. Each topic is one page in the top menu and one folder in `src/app/`.

This project uses **zone.js** (see `app.config.ts`), like most Angular apps in companies.

## How every page works

Every demo on every page has the same 4 parts:

1. **Expect** (yellow): what we are about to test. Guess the answer first.
2. **Steps**: 2 or 3 clicks.
3. **Red box vs green box**: the same feature, without and with the concept.
4. **Conclusion** (green, closed): open it only after you have answered.

Every lab is **Predict → Do → Conclude**. Write your conclusion in one sentence before moving on.

## Plan

| Time | Part |
|------|------|
| 0:00 – 0:10 | Warm-up |
| 0:10 – 0:35 | 1. Lifecycle hooks |
| 0:35 – 1:05 | 2. zone.js, NgZone and OnPush |
| 1:05 – 1:15 | Break |
| 1:15 – 1:40 | 3. trackBy and the old syntax |
| 1:40 – 1:55 | 4. @Input / @Output decorators and NgModule |
| 1:55 – 2:00 | Recap and what's next |

---

## 1. Lifecycle hooks (25 min)

> Why is my @Input undefined in the constructor, but fine in ngOnInit?

| Hook | When | Use it for |
|------|------|-----------|
| `constructor` | object is created, **inputs not set yet** | inject services only |
| `ngOnChanges` | an input changed (also once before ngOnInit) | react to new input values |
| `ngOnInit` | once, inputs are ready | load data, start timers |
| `ngAfterViewInit` | own template is ready | focus, charts, DOM |
| `ngOnDestroy` | just before removal | stop timers, unsubscribe |

**Demos:** Lifecycle page.
- **Demo 1, the birthday card:** the same greeting is made in 3 hooks. Only one stays right.
- **Demo 2, the zombie timer:** two pizza trackers. Close both. One keeps calling the server.

**Lab: kill the zombie** (`lifecycle/pizza-tracker-leaky.ts`)
- **Predict:** you open and close the red tracker 3 times. How many server calls per second after that?
- **Do:**
  1. Try it and count.
  2. In `ngOnDestroy`, add `clearInterval(this.timerId);`.
  3. Try again.
- **Conclude:** finish this sentence: "Whatever I start in ngOnInit, ..."

**Interview check:**
- What is the difference between the constructor and ngOnInit?
- Does ngOnChanges run if you change a property inside an object input (`user.name = 'x'`)?
- Where do you clean up a timer or a subscription?

---

## 2. zone.js, NgZone and OnPush (30 min)

> Who tells Angular to update the screen? And what if it updates too often?

- **Change detection** = Angular checks the templates and updates the screen.
- **zone.js** notices every click, setTimeout and HTTP response and runs change detection.
- **runOutsideAngular** = "don't check for this". **zone.run** = "now check".
- **OnPush** = "only check me when my input reference changes, or when I ask".

**Demos:** Zone page.
- **Demo 1, who updates the screen?** A pizza cooked without zone.js stays "Cooking..." on screen until something else wakes Angular up.
- **Demo 2, too many checks:** the same box, shaken with the mouse. Hundreds of checks vs a few.
- **Demo 3, the cart icon that lies:** an OnPush cart icon misses items added with `push()`.

**Lab: the video player** (`zone/zone.page.ts`)

A video player reports its position 10 times a second. The screen only needs to update once a second.
- **Predict:** how many checks per second will a 100 ms timer cause?
- **Do:**
  1. Add `seconds = 0` and, in a constructor, `setInterval(() => this.seconds++, 100)`. Show `Video: {{ seconds / 10 }}` under the title.
  2. Reset the counter and watch it for 3 seconds.
  3. Wrap the interval in `this.zone.runOutsideAngular(() => { ... })`. Watch the video number. (Remember Demo 1?)
  4. Inside the interval add `if (this.seconds % 10 === 0) this.zone.run(() => {});`.
- **Conclude:** finish this sentence: "runOutsideAngular plus zone.run lets me ..."

**Interview check:**
- What does zone.js do? Do new Angular apps need it?
- When would you use runOutsideAngular?
- Why can an OnPush component show old data? markForCheck vs detectChanges?

---

## Break (10 min)

---

## 3. trackBy and the old syntax (25 min)

> Type in a row, click Refresh, and your text vanishes. One line fixes it.

| Old | New |
|-----|-----|
| `*ngIf="ok; else other"` | `@if (ok) { } @else { }` |
| `*ngFor="let u of users; trackBy: trackById"` | `@for (u of users; track u.id) { }` |
| `[ngSwitch]` + `*ngSwitchCase` | `@switch` / `@case` |
| trackBy is optional | track is required |

**Demos:** Old syntax page.
- **Demo 1, the disappearing notes:** Refresh loads the same people as new objects. One column forgets what you typed.
- **Demo 2, old and new syntax:** two boxes, same result, different code.

**Lab: make the red column green** (`old-syntax/old-syntax.page.ts`)
- **Predict:** what is the smallest change that stops the red column losing your text?
- **Do:**
  1. Add `; trackBy: trackById` to the red column's `*ngFor`.
  2. Type in it and click Refresh.
- **Conclude:** finish this sentence: "trackBy tells Angular ..."

**Interview check:**
- Why do we need trackBy? What does it return?
- Why is `track` required in `@for`?

---

## 4. @Input / @Output decorators and NgModule (15 min)

> Most code you will maintain at your first job still looks like this.

| Old | New |
|-----|-----|
| `@Input() start = 0` | `start = input(0)` |
| `@Output() changed = new EventEmitter<number>()` | `changed = output<number>()` |
| `ngOnChanges` to react | `computed` / `linkedSignal` |

**Demos:** Decorators page.
- **Demo 1, same counter, two styles:** both counters behave the same. Compare the two files.
- **Demo 2, life inside an NgModule:** remove `CommonModule` and see what breaks (and what does not).

**Lab: add a step** (`decorators/counter-old.ts` and `counter-new.ts`)
- **Predict:** how many lines change in each file to add a "step" input?
- **Do:**
  1. Old: add `@Input() step = 1` and use it in `increment()`.
  2. New: add `step = input(1)` and use `this.step()`.
  3. In `decorators.page.ts`, pass `[step]="5"` to both.
- **Conclude:** finish this sentence: "The old and new style differ only in ..."

**Interview check:**
- Standalone component vs one declared in an NgModule?
- What happens if a module forgets `CommonModule`?

---

## Recap (5 min)

1. Read inputs in **ngOnInit / ngOnChanges**, never the constructor. Stop what you started in **ngOnDestroy**.
2. **zone.js** updates the screen after every async event. Use **runOutsideAngular** for noisy events. Under **OnPush**, create new arrays and objects.
3. **trackBy / track** keeps rows (and what's typed in them) when the data is refreshed.
4. Old and new syntax do the same job. You need to read both.

**Next session:** viewChild and content projection, RxJS operators (switchMap, mergeMap, concatMap, exhaustMap), and finding slow code with @defer, the Chrome Performance tab and Angular DevTools.

**Before the next session**, think about this: a user double-clicks "Pay". How do you make sure they are charged only once?
