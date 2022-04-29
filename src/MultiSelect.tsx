import React, { useState } from 'react';

import { makeStyles } from 'tss-react/mui';
import { TextField, AutocompleteChangeReason } from '@mui/material';

import PopupContents from './PopupContents';
import FragmentWrapper from './FragmentWrapper';

import { MultiSelectProps, Option } from './props';
import {
  SEARCH_AREA_HEIGHT,
  LISTBOX_MIN_HEIGHT,
  FOOTER_HEIGHT,
} from './constants/layout';

const useStyles = makeStyles()(() => ({
  paper: {
    minHeight: SEARCH_AREA_HEIGHT + LISTBOX_MIN_HEIGHT + FOOTER_HEIGHT,

    '&$hideSearch': { minHeight: LISTBOX_MIN_HEIGHT + FOOTER_HEIGHT },
    '&$noFooter': { minHeight: SEARCH_AREA_HEIGHT + LISTBOX_MIN_HEIGHT },
    '&$hideSearch$noFooter': { minHeight: LISTBOX_MIN_HEIGHT },
  },

  hideSearch: {},
  noFooter: {},
}));

/**
 * A component to select multiple items from a list of options using the
 * [Material-UI Autocomplete component](https://material-ui.com/components/autocomplete/).
 *
 * To use, you must provide at least the `value`, `onChange`, and `options`
 * props. You should also provide a `label` and `labelPlural` prop. By default,
 * the component is in multi-select mode and values are strings.
 *
 * ## `options` prop
 *
 * The simplest value for the `options` prop is an array of strings.
 *
 * If you need more control over the value returned by MultiSelect, pass an
 * array of `Option` objects, which must follow this type:
 *
 * ```ts
 * type Option<T = string> = {
 *   value: T;
 *   label: string;
 *   disabled?: boolean;
 * }
 * ```
 *
 * ## `value` and `onChange` prop types depend on the `multiple` prop
 *
 * `value` must be an array of `T` in multi-select mode.
 *
 * In single-select mode, it must be either `T` itself or `null`.
 *
 * The first parameter of `onChange` follows the same type as `value`.
 */
export default function MultiSelect<T = string>({
  options: optionsProp,
  value: valueProp,
  onChange,
  label = '',
  max,

  disabled = false,
  multiple = true,
  searchable = true,
  selectAll = true,
  clearable = true,
  freeText = false,

  displayEmpty = false,
  backdrop = false,
  onOpen,
  onClose,
  TextFieldProps = {},
  ...props
}: MultiSelectProps<T>) {
  const { classes, cx } = useStyles();

  // Must control popup open state here to programmatically close it
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
    onOpen?.();
  };
  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };

  // Close the popup when tabbing out
  const handlePaperFocus = (e: React.FocusEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) handleClose();
  };

  // Transform `option` prop if it’s just strings
  const options = (typeof optionsProp[0] === 'string'
    ? (optionsProp as string[]).map((item) => ({ label: item, value: item }))
    : optionsProp) as Option<T>[];

  // Transform `value` to `Option` type
  let value: Option<T>[] | Option<T> | null;
  if (multiple) {
    value = (valueProp as T[])
      .map(
        (item) =>
          options.find((option) => option.value === item) ?? {
            label: item,
            value: item,
          }
      )
      .filter((item) => item !== undefined) as Option<T>[];
  } else {
    if (!valueProp || ((valueProp as unknown) as string) === '') value = null;
    else
      value = options.find((option) => option.value === valueProp) ?? {
        label: (valueProp as unknown) as string,
        value: valueProp as T,
      };
  }

  // If `freeText` enabled, show the user’s custom values
  // at the start of the list
  if (freeText) {
    if (multiple) {
      const valueArray = value as Option<T>[];
      for (let i = valueArray.length - 1; i >= 0; i--) {
        const item = valueArray[i];
        if (options.findIndex((option) => option.value === item.value) <= -1)
          options.unshift(item);
      }
    } else if (value !== null && !!(value as Option<T>).value) {
      if (
        options.findIndex(
          (option) => option.value === (value as Option<T>).value
        ) <= -1
      )
        options.unshift(value as Option<T>);
    }
  }

  const handleChange = (
    _: any,
    newValue: any,
    reason: AutocompleteChangeReason
  ) => {
    if (multiple) {
      onChange(
        newValue.map((item: any) => item.value),
        reason
      );
    } else if (newValue) {
      onChange(newValue.value, reason);
      handleClose();
    }
  };

  const handleSelectAll = () =>
    onChange(options.map((item) => item.value) as any, 'selectOption');
  const handleClear = () =>
    onChange((multiple ? [] : null) as any, 'removeOption');

  // Must declare props to pass to PopupContents here so they to use `as any`
  // keyword to appease TypeScript
  const PopupContentsProps = {
    ...props,
    options,
    // value,
    label,
    searchable,
    selectAll,
    clearable,
    freeText,
    onChange: handleChange,
    onClose: handleClose,
    onSelectAll: handleSelectAll,
    onClear: handleClear,
  };

  return (
    <TextField
      label={label}
      select
      fullWidth
      {...(TextFieldProps as any)}
      disabled={disabled}
      InputLabelProps={{
        shrink:
          displayEmpty ||
          (Array.isArray(valueProp) ? valueProp.length > 0 : !!valueProp),
        ...TextFieldProps.InputLabelProps,
      }}
      SelectProps={{
        open,
        onOpen: handleOpen,
        onClose: handleClose,
        renderValue: (_) => {
          if (Array.isArray(value)) {
            if (value.length === 1) return value[0].label;
            if (value.length > 1)
              return `${value.length} of ${options.length} selected`;
            if (displayEmpty) return `0 of ${options.length} selected`;
            return '';
          } else {
            if (value !== null) return value.label;
            if (displayEmpty) return `0 of ${options.length} selected`;
            return '';
          }
        },
        displayEmpty: true,
        ...TextFieldProps.SelectProps,
        MenuProps: {
          classes: {
            paper: cx(
              classes.paper,
              !searchable && classes.hideSearch,
              !multiple && !clearable && classes.noFooter,
              'MultiSelect-Paper'
            ),
          },
          // Always display the popup below the main select element.
          getContentAnchorEl: null,
          anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
          transformOrigin: { vertical: 'top', horizontal: 'center' },
          // Allow a backdrop to be rendered via prop
          ...TextFieldProps.SelectProps?.MenuProps,
          BackdropProps: {
            invisible: !backdrop,
            ...TextFieldProps.SelectProps?.MenuProps?.BackdropProps,
          },
          // Allow the user to tab out to close the popup
          PaperProps: { onFocus: handlePaperFocus },
          MenuListProps: {
            disablePadding: true,
            component: 'div',
            style: { padding: 0 },
            ...TextFieldProps?.SelectProps?.MenuProps?.MenuListProps,
            autoFocus: false,
            // Remove listbox role. This is created in the Autocomplete listbox.
            role: '',
            // Allow the user to click and tab between elements inside the
            // popup without closing the popup. Also fixes the “S” bug.
            onKeyDown: () => {},
          } as any,
        },
      }}
    >
      <FragmentWrapper>
        {multiple ? (
          <PopupContents
            multiple={true}
            value={value as Option<T>[]}
            max={max}
            {...PopupContentsProps}
          />
        ) : (
          <PopupContents
            multiple={false}
            value={value as Option<T> | null}
            {...PopupContentsProps}
          />
        )}
      </FragmentWrapper>
    </TextField>
  );
}
