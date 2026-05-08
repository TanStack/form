/**
 * Shared helpers for integration tests.
 */

export interface Sample {
  firstName: string;
  lastName: string;
}

export const handleInput = (
  field: { handleChange: (value: string) => void },
  event: Event,
): void => {
  field.handleChange((event.target as HTMLInputElement).value);
};

export const tooShort = ({ value }: { value: string }): string | undefined =>
  value.length < 3 ? 'Not long enough' : undefined;
