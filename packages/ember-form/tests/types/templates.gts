import { hash } from '@ember/helper';
import { createForm, Field, Subscribe } from '@tanstack/ember-form';

interface Person {
  firstName: string;
  age: number;
  hobbies: string[];
}

const PersonForm = createForm({
  defaultValues: { firstName: '', age: 0, hobbies: [] } as Person,
});

const expectString = (value: string) => value;
const expectNumber = (value: number) => value;

const mustBeAdult = ({ value }: { value: number }) =>
  value < 18 ? 'Too young' : undefined;

const mustBeLong = ({ value }: { value: string }) =>
  value.length < 3 ? 'Too short' : undefined;

const pickAge = (state: { values: Person }) => state.values.age;

<template>
  <PersonForm as |tanstackForm|>
    <tanstackForm.Field @name="firstName" as |field|>
      {{expectString field.state.value}}
      {{! @glint-expect-error: the value of firstName is a string }}
      {{expectNumber field.state.value}}
    </tanstackForm.Field>

    <tanstackForm.Field @name="age" as |field|>
      {{expectNumber field.state.value}}
    </tanstackForm.Field>

    {{! @glint-expect-error: no such field }}
    <tanstackForm.Field @name="typo" />

    <tanstackForm.Field @name="age" @validators={{hash onChange=mustBeAdult}} />

    {{! @glint-expect-error: the validator takes a string, and age is a number }}
    <tanstackForm.Field @name="age" @validators={{hash onChange=mustBeLong}} />

    {{! @glint-expect-error: the default value of age is a number }}
    <tanstackForm.Field @name="age" @defaultValue="18" />

    <Field @form={{tanstackForm}} @name="firstName" as |field|>
      {{expectString field.state.value}}
    </Field>

    {{! @glint-expect-error: no such field }}
    <Field @form={{tanstackForm}} @name="typo" />

    <tanstackForm.Subscribe @selector={{pickAge}} as |age|>
      {{expectNumber age}}
      {{! @glint-expect-error: the selector returns a number }}
      {{expectString age}}
    </tanstackForm.Subscribe>

    <tanstackForm.Subscribe as |state|>
      {{expectString state.values.firstName}}
    </tanstackForm.Subscribe>

    <Subscribe @form={{tanstackForm}} @selector={{pickAge}} as |age|>
      {{expectNumber age}}
    </Subscribe>

    {{expectNumber (pickAge tanstackForm.state)}}
  </PersonForm>

  {{! @glint-expect-error: onSubmit receives the form values }}
  <PersonForm @onSubmit={{expectString}} />
</template>
