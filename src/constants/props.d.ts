import { TextFieldProps } from '@material-ui/core';
import { AutocompleteProps } from '@material-ui/lab/Autocomplete';
import {
  UseAutocompleteSingleProps,
  UseAutocompleteMultipleProps,
} from '@material-ui/lab/useAutocomplete';

export type Option<T> = {
  value: T;
  label: string;
  disabled?: boolean;
};

interface MultiSelectCommonProps<T>
  extends Partial<
    Omit<PopupContentsProps<T>, 'options' | 'value' | 'onChange'>
  > {
  options: (Option<T> | string)[];
  /** Display 0 of X selected when empty */
  displayEmpty?: boolean;
  /** Show the backdrop when dropdown open */
  backdrop?: boolean;
  /** Override any props of the root MUI `TextField` component */
  TextFieldProps?: Partial<TextFieldProps>;
}

export type MultiSelectProps<T> =
  | ({
      multiple?: true;
      value: T[];
      onChange: (value: T[]) => void;
    } & MultiSelectCommonProps<T>)
  | ({
      multiple: false;
      value: T;
      onChange: (value: T | null) => void;
    } & MultiSelectCommonProps<T>);

interface PopupContentsCustomProps<T> {
  /** Received from root component */
  onClose: () => void;
  /** Received from root component */
  onSelectAll: () => void;
  /** Received from root component */
  onClear: () => void;

  /** Used as label for search box and no options text */
  labelPlural?: string;
  /** Backup label for search box if `labelPlural` undefined. Used for add item text */
  label?: string;

  /** Optionally prevent the user from searching options. Default: true */
  searchable?: boolean;
  /** Optionally prevent the user to select all options if `multiple`. Default: true */
  selectAll?: boolean;
  /** Optionally allow the user to select all options. Default: true if `selectAll` */
  clearable?: boolean;
  /** Optionally allow the user to add any custom value. Option value **must** be `string`. Default: false */
  freeText?: boolean;

  /** Optionally override how each option is rendered, still showing the checkbox or radio icon. To hide or change the icon, use `Autocomplete`’s `renderOption` prop. */
  itemRenderer?: (option: Option<T>, selected: boolean) => React.ReactNode;
  /** Override any props of the search box MUI `TextField` component */
  SearchBoxProps?: Partial<TextFieldProps>;
}

type PopupContentsMultipleProps<T> = {
  multiple: true;
  /** Must define type here as never undefined */
  options: Option<T>[];
  /** Must define type here as never undefined */
  value: Option<T> | null;
} & PopupContentsCustomProps<T> &
  Partial<AutocompleteProps<Option<T>>> &
  Partial<UseAutocompleteMultipleProps<Option<T>>>;

type PopupContentsSingleProps<T> = {
  multiple: false;
  // Must define type here as never undefined
  options: Option<T>[];
  // Must define type here as never undefined
  value: Option<T>[];
} & PopupContentsCustomProps<T> &
  Partial<AutocompleteProps<Option<T>>> &
  Partial<UseAutocompleteSingleProps<Option<T>>>;

// Explicitly separate type intersections based off `multiple` prop
export type PopupContentsProps<T> =
  | PopupContentsMultipleProps<T>
  | PopupContentsSingleProps<T>;

export type PopupFooterProps = {
  multiple: boolean;
  selectAll: boolean;
  clearable: boolean;
  onSelectAll: () => void;
  onClear: () => void;
  onClose: () => void;
  value: any;
  options: any[];
};
