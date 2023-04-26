import React from "react";
import ReactDOM from "react-dom/client";
import { useForm, FieldApi } from "@tanstack/react-form";

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
      []
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
      <form.Form>
        <div>
          {/* A type-safe and pre-bound field component*/}
          <form.Field
            name="firstName"
            validate={(value) => !value && "A first name is required"}
            validateAsyncOn="change"
            validateAsyncDebounceMs={500}
            validateAsync={async (value) => {
              await new Promise((resolve) => setTimeout(resolve, 1000));
              return (
                value.includes("error") && 'No "error" allowed in first name'
              );
            }}
            children={(field) => (
              // Avoid hasty abstractions. Render props are great!
              <>
                <label htmlFor={field.name}>First Name:</label>
                <input name={field.name} {...field.getInputProps()} />
                <FieldInfo field={field} />
              </>
            )}
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
      </form.Form>
    </div>
  );
}

const rootElement = document.getElementById("root")!;
ReactDOM.createRoot(rootElement).render(<App />);
