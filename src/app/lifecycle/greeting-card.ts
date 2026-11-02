import { Component, Input, OnChanges, OnInit } from '@angular/core';

// A birthday card. It builds the same greeting in 3 different places.
@Component({
  selector: 'app-greeting-card',
  template: `
    <table>
      <tr><td>Made in <code>constructor</code></td><td><b>{{ fromConstructor }}</b></td></tr>
      <tr><td>Made in <code>ngOnInit</code></td><td><b>{{ fromOnInit }}</b></td></tr>
      <tr><td>Made in <code>ngOnChanges</code></td><td><b>{{ fromOnChanges }}</b></td></tr>
    </table>
  `,
})
export class GreetingCard implements OnChanges, OnInit {
  @Input() name?: string;

  fromConstructor = '';
  fromOnInit = '';
  fromOnChanges = '';

  constructor() {
    this.fromConstructor = `Happy birthday, ${this.name}!`;
  }

  ngOnInit() {
    this.fromOnInit = `Happy birthday, ${this.name}!`;
  }

  ngOnChanges() {
    this.fromOnChanges = `Happy birthday, ${this.name}!`;
  }
}
