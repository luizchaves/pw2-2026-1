import { Component, HostListener, input, output } from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [],
  template: `
    <div class="modal-backdrop" role="presentation" (click)="close.emit()">
      <section
        class="modal-panel"
        role="dialog"
        aria-modal="true"
        [attr.aria-label]="title()"
        (click)="$event.stopPropagation()"
      >
        <div class="modal-header">
          <h2>{{ title() }}</h2>
          <button type="button" class="icon-button" aria-label="Fechar" (click)="close.emit()">
            x
          </button>
        </div>
        <ng-content />
      </section>
    </div>
  `,
})
export class ModalComponent {
  readonly title = input.required<string>();
  readonly close = output<void>();

  @HostListener('document:keydown.escape')
  closeOnEscape() {
    this.close.emit();
  }
}
