import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header>
      <b>Angular Core Concepts</b>
      <nav>
        <a routerLink="/lifecycle" routerLinkActive="active">1. Lifecycle</a>
        <a routerLink="/zone" routerLinkActive="active">2. Zone</a>
        <a routerLink="/old-syntax" routerLinkActive="active">3. Old syntax</a>
        <a routerLink="/decorators" routerLinkActive="active">4. Decorators</a>
      </nav>
    </header>
    <main>
      <router-outlet />
    </main>
  `,
})
export class App {}
