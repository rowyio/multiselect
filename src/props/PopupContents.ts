import { TextFieldProps, StandardProps, ButtonProps } from '@material-ui/core';
import {
  AutocompleteProps,
  AutocompleteClassKey,
} from '@material-ui/lab/Autocomplete';
import {
  UseAutocompleteCommonProps,
  UseAutocompleteMultipleProps,
  UseAutocompleteSingleProps,
} from '@material-ui/lab/useAutocomplete';
import { Option } from './Option';

export type PopupContentsCommonProps<T> = {
  onClose: () => void;
  onSelectAll: () => void;
  onClear: () => void;

  /** Used as the label for the search box and no options text */
  labelPlural?: string;
  /**
   * Backup label if `labelPlural` is `undefined`.
   * Also used for “add item” text
   */
  label?: string;

  /** Optionally prevent the user from searching options */
  searchable?: boolean;
  /** Optionally prevent the user to select all options if `multiple: true` */
  selectAll?: boolean;
  /** Optionally prevent from clearing the value */
  clearable?: boolean;
  /**
   * Optionally allow the user to add any custom value.
   * Option value **must** be string
   */
  freeText?: boolean;
  /** Optionally override the text shown in the count on the left of the footer */
  countText?: React.ReactNode;

  /**
   * Optionally override how each option is rendered, while still showing the
   * checkbox or radio icon.
   *
   * To hide or change the icon, use
   * [Autocomplete’s `renderOption` prop](https://material-ui.com/api/autocomplete/)
   */
  itemRenderer?: (option: Option<T>, selected: boolean) => React.ReactNode;
  /**
   * Override certain props of the search box MUI TextField component.
   * [See props here](https://material-ui.com/api/text-field/)
   */
  SearchBoxProps?: Partial<TextFieldProps>;
  /**
   * Override certain props of the Autocomplete component.
   * [See props here](https://material-ui.com/api/autocomplete/)
   */
  AutocompleteProps?: Partial<
    ExposedUseAutocompleteProps<T> & ExposedAutocompleteProps<T>
  >;
  /**
   * Override certain props of the “Add New” Button component.
   * [See props here](https://material-ui.com/api/button/)
   */
  AddButtonProps?: Partial<ButtonProps>;
};

// AutocompleteProps that can be overridden from the root MultiSelect props
type ExposedAutocompleteProps<T> = Omit<
  AutocompleteProps<Option<T>>,
  | keyof UseAutocompleteCommonProps<Option<T>>
  | keyof StandardProps<
      React.HTMLAttributes<HTMLDivElement>,
      AutocompleteClassKey,
      'defaultValue' | 'onChange' | 'children'
    >
  | 'disabled'
  | 'disablePortal'
  | 'multiple'
  | 'PaperComponent'
  | 'PopperComponent'
  | 'renderTags'
  | 'renderInput'
> & { classes: Partial<Record<AutocompleteClassKey, string>> };

// UseAutocompleteProps that can be overridden from the root MultiSelect props
type ExposedUseAutocompleteProps<T> = Omit<
  UseAutocompleteCommonProps<Option<T>>,
  | 'open'
  | 'getOptionLabel'
  | 'getOptionSelected'
  | 'clearOnBlur'
  | 'disableCloseOnSelect'
  | 'onOpen'
  | 'openOnFocus'
>;

export type PopupContentsMultipleProps<T> = {
  multiple: true;
  options: Option<T>[];
  value: Option<T>[];
  onChange: NonNullable<UseAutocompleteMultipleProps<Option<T>>['onChange']>;
} & PopupContentsCommonProps<T>;

export type PopupContentsSingleProps<T> = {
  multiple: false;
  options: Option<T>[];
  value: Option<T> | null;
  onChange: NonNullable<UseAutocompleteSingleProps<Option<T>>['onChange']>;
} & PopupContentsCommonProps<T>;

// Explicitly separate type intersections based off `multiple` prop
export type PopupContentsProps<T> =
  | PopupContentsMultipleProps<T>
  | PopupContentsSingleProps<T>;
