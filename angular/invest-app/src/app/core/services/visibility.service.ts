import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class VisibilityService {
  readonly showValues = signal(true);

  toggleValues() {
    this.showValues.update((value) => !value);
  }
}
