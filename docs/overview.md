---
id: overview
title: Overview
---

TanStack Form is the ultimate solution for handling forms in web applications, providing a powerful and flexible approach to form management. Designed with first-class TypeScript support, headless UI components, and a framework-agnostic design, it streamlines form handling and ensures a seamless experience across various front-end frameworks.

## Motivation

Most web frameworks do not offer a comprehensive solution for form handling, leaving developers to create their own custom implementations or rely on less-capable libraries. This often results in a lack of consistency, poor performance, and increased development time. TanStack Form aims to address these challenges by providing an all-in-one solution for managing forms that is both powerful and easy to use.

With TanStack Form, developers can tackle common form-related challenges such as:

- Reactive data binding and state management
- Complex validation and error handling
- Accessibility and responsive design
- Internationalization and localization
- Cross-platform compatibility and custom styling

By providing a complete solution for these challenges, TanStack Form empowers developers to build robust and user-friendly forms with ease.

## Enough talk, show me some code already!

In the example below, you can see TanStack Form in action with the React framework adapter:

[Open in CodeSandbox](https://codesandbox.io/s/github/tannerlinsley/react-form/tree/main/examples/react/simple)

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { useForm } from "@tanstack/react-form";
import type { FieldApi } from "@tanstack/react-form";

function FieldInfo({ field }: { field: FieldApi<any, any> }) {
  return (
    <>
      {field.state.meta.touchedError ? (
        <em>{field.state.meta.touchedError}</em>
      ) : null}{" "}
      {field.state.meta.isValidating ? "Validating..." : null}
    </>
  );
}

export default function App() {
  const form = useForm({
    // Memoize your default values to prevent re-renders
    defaultValues: React.useMemo(
      () => ({
        firstName: "",
        lastName: "",
      }),
      [],
    ),
    onSubmit: async (values) => {
      // Do something with form data
      console.log(values);
    },
  });

  return (
    <div>
      <h1>Simple Form Example</h1>
      {/* A pre-bound form component */}
      <form.Provider>
        <form {...form.getFormProps()}>
          <div>
            {/* A type-safe and pre-bound field component*/}
            <form.Field
              name="firstName"
              onChange={(value) =>
                !value
                  ? "A first name is required"
                  : value.length < 3
                  ? "First name must be at least 3 characters"
                  : undefined
              }
              onChangeAsyncDebounceMs={500}
              onChangeAsync={async (value) => {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                return (
                  value.includes("error") && 'No "error" allowed in first name'
                );
              }}
              children={(field) => {
                // Avoid hasty abstractions. Render props are great!
                return (
                  <>
                    <label htmlFor={field.name}>First Name:</label>
                    <input name={field.name} {...field.getInputProps()} />
                    <FieldInfo field={field} />
                  </>
                );
              }}
            />
          </div>
          <div>
            <form.Field
              name="lastName"
              children={(field) => (
                <>
                  <label htmlFor={field.name}>Last Name:</label>
                  <input name={field.name} {...field.getInputProps()} />
                  <FieldInfo field={field} />
                </>
              )}
            />
          </div>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <button type="submit" disabled={!canSubmit}>
                {isSubmitting ? "..." : "Submit"}
              </button>
            )}
          />
        </form>
      </form.Provider>
    </div>
  );
}

const rootElement = document.getElementById("root")!;

ReactDOM.createRoot(rootElement).render(<App />);
```

## You talked me into it, so what now?

- Learn React Form at your own pace with our thorough [Walkthrough Guide](../installation) and [API Reference](../reference/FormApi)
