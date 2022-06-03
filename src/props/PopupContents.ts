import {
  TextFieldProps,
  StandardProps,
  AutocompleteProps,
  AutocompleteClassKey,
} from '@mui/material';
import { Option } from './Option';
import { AddItemProps } from './AddItem';

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
  /** Optionally override the text for the Clear button */
  clearText?: string;
  /** Optionally override the text for the Select All button */
  selectAllText?: string;
  /** Optionally override the text for the Done button */
  doneText?: string;

  /**
   * Optionally override how each option is rendered, while still showing the
   * checkbox or radio icon.
   *
   * To hide or change the icon, use
   * [Autocomplete’s `renderOption` prop](https://material-ui.com/api/autocomplete/)
   */
  itemRenderer?: (option: Option<T>, selected: boolean) => React.ReactNode;
  /**
   * Optionally override the checkbox and radio icons.
   */
  itemIcons?: Partial<
    Record<
      'single' | 'singleSelected' | 'multiple' | 'multipleSelected',
      React.ReactNode
    >
  >;
  /**
   * Override certain props of the search box MUI TextField component.
   * [See props here](https://material-ui.com/api/text-field/)
   */
  SearchBoxProps?: Partial<TextFieldProps>;
  /**
   * Override certain props of the “Add New” Button component.
   * [See props here](https://material-ui.com/api/button/)
   */
  AddButtonProps?: AddItemProps['AddButtonProps'];
  /** Override certain props of the “Add New” Dialog. */
  AddDialogProps?: AddItemProps['AddDialogProps'];
};

// AutocompleteProps that can be overridden from the root MultiSelect props
type ExposedAutocompleteProps<
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined
> = Omit<
  AutocompleteProps<Option<T>, Multiple, DisableClearable, FreeSolo>,
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
  | 'open'
  | 'getOptionLabel'
  | 'getOptionSelected'
  | 'clearOnBlur'
  | 'disableCloseOnSelect'
  | 'onOpen'
  | 'openOnFocus'
> & { classes: Partial<Record<AutocompleteClassKey, string>> };

export type PopupContentsMultipleProps<T> = {
  multiple: true;
  options: Option<T>[];
  value: Option<T>[];
  max?: number;
  onChange: NonNullable<
    AutocompleteProps<Option<T>, true, false, true>['onChange']
  >;
  /**
   * Override certain props of the Autocomplete component.
   * [See props here](https://material-ui.com/api/autocomplete/)
   */
  AutocompleteProps?: Partial<ExposedAutocompleteProps<T, true, false, true>>;
} & PopupContentsCommonProps<T>;

export type PopupContentsSingleProps<T> = {
  multiple: false;
  options: Option<T>[];
  value: Option<T> | null;
  max?: undefined;
  onChange: NonNullable<
    AutocompleteProps<Option<T>, false, false, true>['onChange']
  >;
  /**
   * Override certain props of the Autocomplete component.
   * [See props here](https://material-ui.com/api/autocomplete/)
   */
  AutocompleteProps?: Partial<ExposedAutocompleteProps<T, false, false, true>>;
} & PopupContentsCommonProps<T>;

// Explicitly separate type intersections based off `multiple` prop
export type PopupContentsProps<T> =
  | PopupContentsMultipleProps<T>
  | PopupContentsSingleProps<T>;
