import React from "react";
import ReactDOM from "react-dom/client";
import { FieldApi, createFormFactory, useField } from "@tanstack/react-form";

type Person = {
  firstName: string;
  lastName: string;
  hobbies: Hobby[];
};

type Hobby = {
  name: string;
  description: string;
  yearsOfExperience: number;
};

const formFactory = createFormFactory<Person>({
  defaultValues: {
    firstName: "",
    lastName: "",
    hobbies: [],
  },
});

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
  const form = formFactory.useForm({
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
                <input {...field.getInputProps()} />
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
                <input {...field.getInputProps()} />
                <FieldInfo field={field} />
              </>
            )}
          />
        </div>
        <div>
          <form.Field
            name="hobbies"
            mode="array"
            children={(hobbiesField) => (
              <div>
                Hobbies
                <div
                  style={{
                    paddingLeft: "1rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  {!hobbiesField.state.value.length
                    ? "No hobbies found."
                    : hobbiesField.state.value.map((_, i) => (
                        <div
                          key={i}
                          style={{
                            borderLeft: "2px solid gray",
                            paddingLeft: ".5rem",
                          }}
                        >
                          <hobbiesField.Field
                            index={i}
                            name="name"
                            children={(field) => {
                              return (
                                <div>
                                  <label htmlFor={field.name}>Name:</label>
                                  <input
                                    name={field.name}
                                    {...field.getInputProps()}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => hobbiesField.removeValue(i)}
                                  >
                                    X
                                  </button>
                                  <FieldInfo field={field} />
                                </div>
                              );
                            }}
                          />
                          <hobbiesField.Field
                            index={i}
                            name="description"
                            children={(field) => {
                              return (
                                <div>
                                  <label htmlFor={field.name}>
                                    Description:
                                  </label>
                                  <input
                                    name={field.name}
                                    {...field.getInputProps()}
                                  />
                                  <FieldInfo field={field} />
                                </div>
                              );
                            }}
                          />
                        </div>
                      ))}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    hobbiesField.pushValue({
                      name: "",
                      description: "",
                      yearsOfExperience: 0,
                    })
                  }
                >
                  Add hobby
                </button>
              </div>
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
