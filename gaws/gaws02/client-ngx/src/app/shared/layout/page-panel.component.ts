import { Component, input } from '@angular/core';

@Component({
  selector: 'app-page-panel',
  standalone: true,
  template: `
    <section class="page-shell">
      <div class="page-panel">
        <h1>{{ title() }}</h1>
        <ng-content />
      </div>
    </section>
  `,
  styles: [
    `
      .page-shell {
        max-width: 920px;
        margin: 0 auto;
      }

      .page-panel {
        background: #fff;
        border: 1px solid #d9e2ec;
        border-radius: 4px;
        padding: 20px;
      }

      h1 {
        margin: 0 0 16px;
      }
    `
  ]
})
export class PagePanelComponent {
  readonly title = input.required<string>();
}
