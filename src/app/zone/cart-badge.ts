import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, inject } from '@angular/core';

// The cart icon in the header of a shopping site.
// OnPush: Angular only re-checks it when the `items` REFERENCE changes (or when we ask).
@Component({
  selector: 'app-cart-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p>Cart icon: <span class="big">{{ items.length }}</span></p>`,
})
export class CartBadge {
  @Input() items: string[] = [];

  private cdr = inject(ChangeDetectorRef);

  // "Please check me in the next round"
  refresh() {
    this.cdr.markForCheck();
  }
}
