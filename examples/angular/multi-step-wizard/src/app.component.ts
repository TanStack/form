import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { injectForm } from '@tanstack/angular-form'
import { StepOneComponent } from './step-one.component'
import { StepTwoComponent } from './step-two.component'
import { wizardFormOptions } from './shared-form'

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StepOneComponent, StepTwoComponent],
  template: `
    <main>
      <h1>Multi-step Wizard</h1>
      @if (step() === 0) {
        <app-step-one [form]="form" [advance]="advance" />
      } @else {
        <app-step-two [form]="form" [back]="back" />
      }
    </main>
  `,
})
export class AppComponent {
  step = signal(0)
  form = injectForm(wizardFormOptions)
  advance = () => this.step.set(1)
  back = () => this.step.set(0)
}
