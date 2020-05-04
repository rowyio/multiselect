import React, { useState } from 'react';

import { makeStyles, createStyles, TextField } from '@material-ui/core';

import PopupContents from './PopupContents';
import PopupWrapper from './PopupWrapper';

import { MultiSelectProps, Option } from './constants/props';
import {
  SEARCH_AREA_HEIGHT,
  LISTBOX_MIN_HEIGHT,
  FOOTER_HEIGHT,
} from './constants/layout';

const useStyles = makeStyles(() =>
  createStyles({
    paper: {
      minHeight: SEARCH_AREA_HEIGHT + LISTBOX_MIN_HEIGHT + FOOTER_HEIGHT,
    },
  })
);

export default function MultiSelect<T = string>({
  options: optionsProp,
  value: valueProp,
  onChange,

  multiple = true,

  displayEmpty = false,
  backdrop = false,
  TextFieldProps,
  ...props
}: MultiSelectProps<T>) {
  const { freeText, label } = props;
  const classes = useStyles();

  // Must control popup open state here to programmatically close it
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Close the popup when tabbing out
  const handlePaperFocus = (e: React.FocusEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) handleClose();
  };

  // Transform `option` prop if it’s just strings
  const options = optionsProp.map(
    item =>
      (typeof item === 'string'
        ? { label: item, value: item }
        : item) as Option<T>
  );

  // Transform `value` to `Option` type
  let value: Option<T>[] | Option<T> | null;
  if (multiple) {
    value = (valueProp as T[])
      .map(item =>
        typeof optionsProp[0] === 'string'
          ? { label: item, value: item }
          : options.find(option => option.value === item)
      )
      .filter(item => item !== undefined) as Option<T>[];
  } else {
    if (!valueProp || ((valueProp as unknown) as string) === '') {
      value = null;
    } else {
      if (typeof valueProp === 'string')
        value = { label: valueProp as string, value: valueProp as T };
      else value = options.find(option => option.value === valueProp) ?? null;
    }
  }

  // If `freeText` enabled, show the user’s custom values
  // at the start of the list
  if (freeText) {
    if (multiple) {
      const valueArray = value as Option<T>[];
      for (let i = valueArray.length - 1; i >= 0; i--) {
        const item = valueArray[i];
        if (options.findIndex(option => option.value === item.value) <= -1)
          options.unshift(item);
      }
    } else if (value !== null && !!(value as Option<T>).value) {
      if (
        options.findIndex(
          option => option.value === (value as Option<T>).value
        ) <= -1
      )
        options.unshift(value as Option<T>);
    }
  }

  const handleChange = (_: any, newValue: any) => {
    if (multiple) {
      onChange(newValue.map((item: any) => item.value));
    } else {
      onChange(newValue.value);
      handleClose();
    }
  };

  const handleSelectAll = () =>
    onChange(options.map(item => item.value) as any);
  const handleClear = () => onChange((multiple ? [] : null) as any);

  // Must declare props to pass to PopupContents here so they to use `as any`
  // keyword to appease TypeScript
  const PopupContentsProps = {
    ...props,
    multiple,
    options,
    value,
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
      InputLabelProps={{
        shrink:
          displayEmpty ||
          (Array.isArray(valueProp) ? valueProp.length > 0 : !!valueProp),
        ...TextFieldProps?.InputLabelProps,
      }}
      SelectProps={{
        open,
        onOpen: handleOpen,
        onClose: handleClose,
        renderValue: _ => {
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
        ...TextFieldProps?.SelectProps,
        MenuProps: {
          classes: { paper: classes.paper },
          // Always display the popup below the main select element.
          getContentAnchorEl: null,
          anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
          transformOrigin: { vertical: 'top', horizontal: 'center' },
          // Allow a backdrop to be rendered via prop
          ...TextFieldProps?.SelectProps?.MenuProps,
          BackdropProps: {
            invisible: !backdrop,
            ...TextFieldProps?.SelectProps?.MenuProps?.BackdropProps,
          },
          // Allow the user to tab out to close the popup
          PaperProps: { onFocus: handlePaperFocus },
          MenuListProps: {
            disablePadding: true,
            component: 'div',
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
      <PopupWrapper>
        <PopupContents {...(PopupContentsProps as any)} />
      </PopupWrapper>
    </TextField>
  );
}
