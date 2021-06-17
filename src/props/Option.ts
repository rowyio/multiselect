/**
 * Internal option and value type passed directly to the Autocomplete component
 */
export type Option<T> = {
  value: T;
  label: string;
  disabled?: boolean;
  [key: string]: any;
};
