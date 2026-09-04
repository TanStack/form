import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'

import { type } from 'arktype'
import { Schema as S } from 'effect'
import * as v from 'valibot'
import { z } from 'zod'

import { useForm } from '@tanstack/react-form'

import type { AnyFieldApi } from '@tanstack/react-form'

function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <View>
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <Text style={styles.error}>
          {field.state.meta.errors.map((err) => err.message).join(',')}
        </Text>
      ) : null}
      {field.state.meta.isValidating ? <Text>Validating...</Text> : null}
    </View>
  )
}

const ZodSchema = z.object({
  firstName: z
    .string()
    .min(3, '[Zod] You must have a length of at least 3')
    .startsWith('A', "[Zod] First name must start with 'A'"),
  lastName: z.string().min(3, '[Zod] You must have a length of at least 3'),
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ValibotSchema = v.object({
  firstName: v.pipe(
    v.string(),
    v.minLength(3, '[Valibot] You must have a length of at least 3'),
    v.startsWith('A', "[Valibot] First name must start with 'A'"),
  ),
  lastName: v.pipe(
    v.string(),
    v.minLength(3, '[Valibot] You must have a length of at least 3'),
  ),
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ArkTypeSchema = type({
  firstName: 'string >= 3',
  lastName: 'string >= 3',
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const EffectSchema = S.standardSchemaV1(
  S.Struct({
    firstName: S.String.pipe(
      S.minLength(3),
      S.annotations({
        message: () => '[Effect/Schema] You must have a length of at least 3',
      }),
    ),
    lastName: S.String.pipe(
      S.minLength(3),
      S.annotations({
        message: () => '[Effect/Schema] You must have a length of at least 3',
      }),
    ),
  }),
)

export default function App() {
  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
    },
    validators: {
      // DEMO: You can switch between schemas seamlessly
      onChange: ZodSchema,
      // onChange: ValibotSchema,
      // onChange: ArkTypeSchema,
      // onChange: EffectSchema,
    },
    onSubmit: async ({ value }) => {
      // Do something with form data
      console.log(value)
    },
  })

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Standard Schema Form Example</Text>

      <View style={styles.field}>
        <form.Field
          name="firstName"
          children={(field) => (
            <>
              <Text style={styles.label}>First Name:</Text>
              <TextInput
                style={styles.input}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChangeText={(text) => field.handleChange(text)}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <FieldInfo field={field} />
            </>
          )}
        />
      </View>

      <View style={styles.field}>
        <form.Field
          name="lastName"
          children={(field) => (
            <>
              <Text style={styles.label}>Last Name:</Text>
              <TextInput
                style={styles.input}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChangeText={(text) => field.handleChange(text)}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <FieldInfo field={field} />
            </>
          )}
        />
      </View>

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]) => (
          <Button
            title={isSubmitting ? '...' : 'Submit'}
            disabled={!canSubmit}
            onPress={() => form.handleSubmit()}
          />
        )}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  field: {
    gap: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
  },
  error: {
    color: '#c00',
    fontSize: 13,
  },
})
