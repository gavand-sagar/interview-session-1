import { Injectable, signal } from '@angular/core';

// Counts how many times each pizza tracker "called the server".
@Injectable()
export class ServerCalls {
  readonly leaky = signal(0);
  readonly clean = signal(0);
}
