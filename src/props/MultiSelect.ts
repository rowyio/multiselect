import { TextFieldProps, AutocompleteChangeReason } from '@mui/material';
import { Option } from './Option';
import { PopupContentsCommonProps } from './PopupContents';

interface MultiSelectCommonProps<T>
  extends Partial<
    Omit<PopupContentsCommonProps<T>, PrivatePopupContentsProps>
  > {
  /**
   * The options used by Autocomplete.
   *
   * If an array of strings is provided, each value will be mapped to
   * an `Option` object
   */
  options: Option<T>[] | string[];
  /**
   * Disable the field entirely.
   * Also prevents Autocomplete from being rendered
   */
  disabled?: boolean;
  /** Display “0 of X selected” when empty */
  displayEmpty?: boolean;
  /** Show the backdrop when the dropdown popup is open */
  backdrop?: boolean;
  /** Maximum number of items can be selected */
  max?: number;
  /** Callback fired when popup opens */
  onOpen?: () => void;
  /** Callback fired when popup closes */
  onClose?: () => void;
  /**
   * Override any props of the root MUI TextField component.
   * [See props here](https://material-ui.com/api/text-field/)
   */
  TextFieldProps?: Partial<TextFieldProps>;
}

// Explicitly separate type intersections based off `multiple` prop
export type MultiSelectProps<T> =
  | ({
      /**
       * **⚠️ Important:** This prop dictates the type of the
       * `value` and `onChange` props
       */
      multiple?: true;
      /**
       * The value of MultiSelect. This component must be controlled.
       *
       * The value must have reference equality with the option in order to be
       * selected. You can customize the equality behavior with the
       * [Autocomplete `getOptionSelected` prop](https://material-ui.com/api/autocomplete/)
       *
       * **⚠️ Important:**
       *
       * - If `multiple: true`, this prop must be an array of values
       * - If `multiple: false`, this prop must be either the value itself or `null`
       */
      value: T[];
      /**
       * Callback fired when the value changes.
       *
       * `value` parameter type is the same as the `value` prop type above.
       *
       * Note if `multiple: false`, the `value` parameter may be `null` and the
       * popup will automatically close whenever the value changes
       */
      onChange: (value: T[], reason: AutocompleteChangeReason) => void;
    } & MultiSelectCommonProps<T>)
  | ({
      multiple: false;
      value: T | null;
      onChange: (value: T | null, reason: AutocompleteChangeReason) => void;
    } & MultiSelectCommonProps<T>);

type PrivatePopupContentsProps =
  | 'multiple'
  | 'options'
  | 'value'
  | 'onChange'
  | 'onClose'
  | 'onSelectAll'
  | 'onClear';
