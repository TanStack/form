import React from "react";
import ReactDOM from "react-dom/client";
import { useForm } from "@tanstack/react-form";

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
    onSubmit: (values) => {
      // Do something with form data
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
            children={(field) => (
              // Avoid hasty abstractions. Render props are great!
              <>
                <label htmlFor={field.name}>First Name:</label>
                <input name={field.name} {...field.getInputProps()} />
                {field.state.meta.touchedError && (
                  <em>{field.state.meta.touchedError}</em>
                )}
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
                {field.state.meta.touchedError && (
                  <em>{field.state.meta.touchedError}</em>
                )}
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

const rootElement = document.getElementById("root");
ReactDOM.createRoot(rootElement).render(<App />);
