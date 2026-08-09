import { ChangeDetectionStrategy, Component, input } from '@angular/core'
import { render } from '@testing-library/angular'
import { describe, expect, it } from 'vitest'
import { TanStackField, formOptions, injectForm } from '../src/index'
import type { AngularFormType } from '../src/index'

describe('AngularFormType', () => {
  it('types a plain child component form input from reusable options', async () => {
    const personFormOptions = formOptions({
      defaultValues: { firstName: '', lastName: 'Lovelace' },
    })

    @Component({
      selector: 'app-child-form',
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [TanStackField],
      template: `
        <ng-container [tanstackField]="form()" name="lastName" #field="field">
          <label [for]="field.api.name">Last name:</label>
          <input
            [id]="field.api.name"
            [value]="field.api.value"
            (input)="field.api.handleChange($any($event).target.value)"
          />
        </ng-container>
      `,
    })
    class ChildForm {
      form = input.required<AngularFormType<typeof personFormOptions>>()
    }

    @Component({
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [ChildForm],
      template: `<app-child-form [form]="form" />`,
    })
    class AppComponent {
      form = injectForm({
        ...personFormOptions,
        onSubmit: () => undefined,
      })
    }

    const screen = await render(AppComponent)
    expect(screen.getByLabelText('Last name:')).toHaveValue('Lovelace')
  })
})
