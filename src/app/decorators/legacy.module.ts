import { Component, computed, input, Input, NgModule, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rating',
  template: `
    @for(item of all;track item){
      @if(value() >= item){
        <button 
        (click)="value.set(item)"
        [style.backgroundColor]="'red'">+</button>
      } @else{
        <button  (click)="value.set(item)">+</button>
      }
    }
    
  `
})
export class Rating {
  value = signal<number>(4)
  all = [1, 2, 3, 4, 5]
}



// Before standalone components, every component belonged to an NgModule.
@Component({
  selector: 'app-legacy-greeting',
  standalone: false, // this component is declared in a module
  template: `<app-rating/>`,
})
export class LegacyGreeting {
  @Input() name = '';
}

@NgModule({
  declarations: [LegacyGreeting], // components that belong to this module
  imports: [CommonModule, Rating], // what those components need (ngIf, ngFor...)
  exports: [LegacyGreeting], // what other code may use from this module
})
export class LegacyModule { }
