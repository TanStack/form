---
id: arrays
title: Arrays
---

TanStack Form supports arrays as values in a form, including sub-object values inside of an array.

## Basic Usage

To use an array, you can use `field.api.state.value` on an array value:

```angular-ts
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TanStackField],
  template: `
    <ng-container [tanstackField]="form" name="people" #people="field">
      <div>
        @for (_ of people.api.state.value; track $index) {
          <!-- ... -->
        }
      </div>
    </ng-container>
  `,
})
export class AppComponent {
  form = injectForm({
    defaultValues: {
      people: [] as Array<{ name: string; age: number }>,
    },
    onSubmit({ value }) {
      alert(JSON.stringify(value))
    },
  })
}
```

This will generate the mapped JSX every time you run `pushValue` on `field`:

```angular-html
<button (click)="people.api.pushValue(defaultPerson)" type="button">
  Add person
</button>
```

Finally, you can use a subfield like so:

```angular-html
 <ng-container
  [tanstackField]="form"
  [name]="getPeopleName($index)"
  #person="field"
>
  <div>
    <label>
      <div>Name for person {{ $index }}</div>
      <input
        [value]="person.api.state.value"
        (input)="
          person.api.handleChange($any($event).target.value)
        "
      />
    </label>
  </div>
</ng-container>
```

Where `getPeopleName` is a method on the class like so

```typescript
export class AppComponent {
  getPeopleName = (idx: number) => `people[${idx}].name` as const

  // ...
}
```

> While it's unfortunate that you need to use a function to get the field name, it's a requirement for how our strict TypeScript types work.
>
> See, if we did the following:
>
> ```angular-html
> <ng-container [tanstackField]="form" [name]="'people[' + $index + '].name'"></ng-container>
> ```
>
> We'd be running into a TypeScript issue where `"one" + "two"` is `string` rather than the required `"onetwo"` type
>
> Moreover, while Angular supports template literals in the template, they may not contain dynamic interpolation within them, such as our `$index` argument.

> It's possible that we've missed something! If you can think of a better fix for this problem, [drop us a line on our GitHub discussions](https://github.com/TanStack/form/discussions).

## Full Example

```angular-ts
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TanStackField],
  template: `
    <form (submit)="handleSubmit($event)">
      <div>
        <ng-container [tanstackField]="form" name="people" #people="field">
          <div>
            @for (_ of people.api.state.value; track $index) {
              <ng-container
                [tanstackField]="form"
                [name]="getPeopleName($index)"
                #person="field"
              >
                <div>
                  <label>
                    <div>Name for person {{ $index }}</div>
                    <input
                      [value]="person.api.state.value"
                      (input)="
                        person.api.handleChange($any($event).target.value)
                      "
                    />
                  </label>
                </div>
              </ng-container>
            }
          </div>
          <button (click)="people.api.pushValue(defaultPerson)" type="button">
            Add person
          </button>
        </ng-container>
      </div>
      <button type="submit" [disabled]="!canSubmit()">
        {{ isSubmitting() ? '...' : 'Submit' }}
      </button>
    </form>
  `,
})
export class AppComponent {
  defaultPerson = { name: '', age: 0 }

  form = injectForm({
    defaultValues: {
      people: [] as Array<{ name: string; age: number }>,
    },
    onSubmit({ value }) {
      alert(JSON.stringify(value))
    },
  })


  getPeopleName = (idx: number) => `people[${idx}].name` as const;

  canSubmit = injectStore(this.form, (state) => state.canSubmit)
  isSubmitting = injectStore(this.form, (state) => state.isSubmitting)

  handleSubmit(event: SubmitEvent) {
    event.preventDefault()
    event.stopPropagation()
    this.form.handleSubmit()
  }
}
```
