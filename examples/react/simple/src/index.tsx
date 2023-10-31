import * as React from "react";
import { createRoot } from "react-dom/client";
import { useForm } from "@tanstack/react-form";
import type { FieldApi } from "@tanstack/react-form";

function FieldInfo({ field }: { field: FieldApi<any, any, unknown, unknown> }) {
  return (
    <>
      {field.state.meta.touchedErrors ? (
        <em>{field.state.meta.touchedErrors}</em>
      ) : null}
      {field.state.meta.isValidating ? "Validating..." : null}
    </>
  );
}

export default function App() {
  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
    },
    onSubmit: async (values) => {
      // Do something with form data
      console.log(values);
    },
  });

  return (
    <div>
      <h1>Simple Form Example</h1>
      <form.Provider>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void form.handleSubmit();
          }}
        >
          <div>
            {/* A type-safe field component*/}
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
                    <input
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
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
                  <input
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
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

createRoot(rootElement).render(<App />);
