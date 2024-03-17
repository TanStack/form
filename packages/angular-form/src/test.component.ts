import { Component, Directive, Input } from '@angular/core'

@Directive({
  selector: '[tanstackField]',
  standalone: true,
})
class TanStackField {
  @Input() tanstackField: any;
}

function injectForm(opts?: any) {
  return {} as any
}

@Component({
  selector: 'test-component',
  standalone: true,
  imports: [TanStackField],
  template: `
    <p>Testing</p>
    <form (submit)="handleSubmit($event)">
      <ng-template *tanstackField="form" name="firstName" let-field>
        <label>
          <div>First name:</div>
          <input
            [name]="field.name"
            [value]="field.value"
            (blur)="field.handleBlur()"
            (input)="field.handleChange($any($event).target.value)"
          />
        </label>
      </ng-template>
      <button>Submit</button>
    </form>
  `,
})
export class TestComponent {
  form = injectForm({
    defaultValues: {
      firstName: 'Ryan',
    },
    onSubmit({ value }: any) {
      console.log({ value })
    },
  })

  handleSubmit(event: SubmitEvent) {
    event.preventDefault()
    event.stopPropagation()
    void this.form.handleSubmit()
  }
}
