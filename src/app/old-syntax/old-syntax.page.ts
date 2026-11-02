import { Component } from '@angular/core';
import { NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { USERS, User } from '../shared/data';

@Component({
  selector: 'app-old-syntax-page',
  imports: [NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault],
  template: `
    <h1>3. trackBy and the old syntax</h1>
    <p class="hook">Type in a row, click Refresh, and your text vanishes. One line fixes it.</p>

    <div class="box">
      <h2>Demo 1: The disappearing notes</h2>
      <div class="expect"><b>Expect:</b> Refresh loads the same 3 people again, like a fresh API response. One column forgets everything you typed.</div>
      <ol class="steps">
        <li>Type something next to every name, in all 3 columns.</li>
        <li>Click <b>Refresh</b>. Which column lost your text?</li>
      </ol>
      <button (click)="refresh()">Refresh (same people, new objects)</button>
      <div class="row">
        <div class="bad">
          <h3>*ngFor without trackBy</h3>
          <div *ngFor="let user of users">{{ user.name }} <input placeholder="type here" /></div>
        </div>
        <div class="good">
          <h3>*ngFor with trackBy</h3>
          <div *ngFor="let user of users; trackBy: trackById">{{ user.name }} <input placeholder="type here" /></div>
        </div>
        <div class="good">
          <h3>&#64;for with track</h3>
          @for (user of users; track user.id) {
            <div>{{ user.name }} <input placeholder="type here" /></div>
          }
        </div>
      </div>
      <details class="conclude">
        <summary>Conclusion (open after the demo)</summary>
        <p>Without trackBy, Angular matches rows by object. New objects = every row is destroyed and built again, so typed text, focus and scroll position are lost. It is also slower.</p>
        <p><b>trackBy</b> says "same id = same row, keep it". <b>&#64;for</b> makes track required so nobody forgets.</p>
      </details>
    </div>

    <div class="box">
      <h2>Demo 2: Old syntax and new syntax</h2>
      <div class="expect"><b>Expect:</b> both boxes show exactly the same thing. Only the code is different.</div>
      <ol class="steps">
        <li>Click <b>Toggle roles</b> a few times. Both boxes change together.</li>
        <li>Open this file and compare the two templates.</li>
      </ol>
      <button (click)="showRoles = !showRoles">Toggle roles</button>
      <div class="row">
        <div class="box">
          <h3>Old: *ngIf, *ngFor, [ngSwitch]</h3>
          <div *ngIf="showRoles; else hidden">
            <div *ngFor="let user of users; trackBy: trackById">
              {{ user.name }}:
              <ng-container [ngSwitch]="user.role">
                <span *ngSwitchCase="'admin'" class="tag">full access</span>
                <span *ngSwitchCase="'editor'" class="tag">can edit</span>
                <span *ngSwitchDefault class="tag">read only</span>
              </ng-container>
            </div>
          </div>
          <ng-template #hidden><p class="muted">Roles are hidden</p></ng-template>
        </div>
        <div class="box">
          <h3>New: &#64;if, &#64;for, &#64;switch</h3>
          @if (showRoles) {
            @for (user of users; track user.id) {
              <div>
                {{ user.name }}:
                @switch (user.role) {
                  @case ('admin') { <span class="tag">full access</span> }
                  @case ('editor') { <span class="tag">can edit</span> }
                  @default { <span class="tag">read only</span> }
                }
              </div>
            }
          } @else {
            <p class="muted">Roles are hidden</p>
          }
        </div>
      </div>
      <details class="conclude">
        <summary>Conclusion (open after the demo)</summary>
        <p>Same result. The new syntax needs no imports, has no ng-template for else, and track is required.</p>
        <p>Most company code still uses the old syntax, so you must be able to read both.</p>
      </details>
    </div>
  `,
})
export default class OldSyntaxPage {
  users: User[] = USERS.map((u) => ({ ...u }));
  showRoles = true;

  // Same people, brand new objects (like a fresh response from an API)
  refresh() {
    this.users = USERS.map((u) => ({ ...u }));
  }

  trackById(index: number, user: User) {
    return user.id;
  }
}
