import { Component, Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Before standalone components, every component belonged to an NgModule.
@Component({
  selector: 'app-legacy-greeting',
  standalone: false, // this component is declared in a module
  template: `<p *ngIf="name">Hello {{ name }}, I live inside LegacyModule.</p>`,
})
export class LegacyGreeting {
  @Input() name = '';
}

@NgModule({
  declarations: [LegacyGreeting], // components that belong to this module
  imports: [CommonModule], // what those components need (ngIf, ngFor...)
  exports: [LegacyGreeting], // what other code may use from this module
})
export class LegacyModule {}
