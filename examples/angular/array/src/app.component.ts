import { ChangeDetectionStrategy, Component } from '@angular/core'
import {
  TanStackArrayField,
  TanStackField,
  injectForm,
  injectSelector,
} from '@tanstack/angular-form'

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TanStackArrayField, TanStackField],
  template: `
    <main>
      <h1>Arrays in Form Example</h1>
      <label for="itemsAmount">
        Enter the amount of items to render. Updating resets the form.
      </label>
      <div class="actions">
        <input
          id="itemsAmount"
          type="number"
          [value]="requestedAmount"
          min="1"
          step="1"
          max="10000"
          (input)="requestedAmount = $any($event).target.valueAsNumber"
        />
        <button type="button" (click)="updateItems()">Update</button>
      </div>

      <h2>Item amount: {{ itemAmount() }}</h2>
      <form (submit)="handleSubmit($event)">
        <div class="actions">
          <button type="submit">Submit</button>
          <button
            type="button"
            (click)="form.pushFieldValue('items', 'New Field')"
          >
            Create item
          </button>
        </div>

        <ng-container
          [tanstackArrayField]="form"
          name="items"
          #items="arrayField"
        >
          <ul>
            @for (_ of items.api.value; track $index) {
              <li>
                <ng-container
                  [tanstackField]="form"
                  [name]="itemName($index)"
                  #item="field"
                >
                  <label>
                    <span>Field {{ $index }}</span>
                    <input
                      [name]="item.api.name"
                      [value]="item.api.value"
                      (blur)="item.api.handleBlur()"
                      (input)="item.api.handleChange($any($event).target.value)"
                    />
                  </label>
                </ng-container>
              </li>
            }
          </ul>
        </ng-container>
      </form>
    </main>
  `,
})
export class AppComponent {
  requestedAmount = 50
  form = injectForm({
    defaultValues: { items: Array.from({ length: 50 }, () => '') },
    onSubmit: ({ value }) => {
      console.log(value)
      alert(`Submitted ${value.items.length} items.`)
    },
  })
  itemAmount = injectSelector(this.form, (state) => state.values.items.length)

  itemName(index: number): `items[${number}]` {
    return `items[${index}]`
  }

  updateItems() {
    if (Number.isNaN(this.requestedAmount)) return
    const amount = Math.min(10_000, Math.max(0, this.requestedAmount))
    this.form.reset({ items: Array.from({ length: amount }, () => '') })
  }

  handleSubmit(event: SubmitEvent) {
    event.preventDefault()
    event.stopPropagation()
    this.form.handleSubmit()
  }
}
