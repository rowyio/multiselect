import React from 'react';
import clsx from 'clsx';

import {
  makeStyles,
  createStyles,
  TextField,
  InputAdornment,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

import SearchIcon from '@material-ui/icons/Search';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';

import FragmentWrapper from './FragmentWrapper';
import AddItem from './AddItem';
import PopupFooter from './PopupFooter';

import { PopupContentsProps, Option } from './props';
import {
  SEARCH_AREA_HEIGHT,
  LISTBOX_MIN_HEIGHT,
  LISTBOX_MIN_WIDTH,
  FOOTER_HEIGHT,
} from './constants/layout';

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      '&$hideSearch': { marginTop: -SEARCH_AREA_HEIGHT },
    },
    hideSearch: {},
    noFooter: {},
    freeText: {},

    paper: { margin: 0 },
    popper: {
      minWidth: LISTBOX_MIN_WIDTH,
      width: '100% !important',
    },
    popperDisablePortal: { position: 'relative' },

    search: {
      margin: theme.spacing(2, 2, 0),
      width: `calc(100% - ${theme.spacing(2 * 2)}px)`,
    },
    searchInput: { borderRadius: theme.shape.borderRadius },
    searchLabel: {
      paddingRight: theme.spacing(7),
      width: '100%',
      boxSizing: 'border-box',

      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      lineHeight: 'normal',
      top: -3,
    },
    searchLabelShrink: { paddingRight: 0 },

    listbox: {
      boxSizing: 'border-box',
      minHeight: LISTBOX_MIN_HEIGHT,
      maxHeight: `calc(100vh - 96px - ${SEARCH_AREA_HEIGHT}px - ${FOOTER_HEIGHT}px)`,

      '&$freeText': {
        maxHeight: `calc(100vh - 96px - ${SEARCH_AREA_HEIGHT}px - ${FOOTER_HEIGHT *
          2}px)`,
      },

      '&$hideSearch': { minHeight: LISTBOX_MIN_HEIGHT + SEARCH_AREA_HEIGHT },
      '&$noFooter': { minHeight: LISTBOX_MIN_HEIGHT + FOOTER_HEIGHT },
      '&$hideSearch$noFooter': {
        minHeight: LISTBOX_MIN_HEIGHT + SEARCH_AREA_HEIGHT + FOOTER_HEIGHT,
      },
    },
    noOptions: {
      ...theme.typography.button,
      color: theme.palette.text.secondary,
      userSelect: 'none',

      height: LISTBOX_MIN_HEIGHT,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },

    option: {
      ...theme.typography.body2,

      position: 'relative',
      marginBottom: 1,

      // Bottom divider
      '&::after': {
        content: '""',
        display: 'block',

        position: 'absolute',
        bottom: -1,
        left: theme.spacing(52 / 8),
        right: theme.spacing(2),

        backgroundColor: theme.palette.divider,
        height: 1,
      },

      // Don’t highlight selected items to prevent confusion on what is focused
      '&[aria-selected="true"]': { backgroundColor: 'transparent' },
      // Undo this override when the item is focused
      '&[aria-selected="true"][data-focus="true"]': {
        backgroundColor: theme.palette.action.hover,
      },
    },
    optionIcon: { margin: theme.spacing(0, 2, 0, -(3 / 8)) },
  })
);

export default function PopupContents<T>({
  multiple,
  options,
  value,
  onChange,

  onClose,
  onSelectAll,
  onClear,

  labelPlural = '',
  label = '',

  searchable = true,
  selectAll = true,
  clearable = true,
  freeText = false,
  countText,

  itemRenderer,
  SearchBoxProps,
  AutocompleteProps,
  AddButtonProps,
}: PopupContentsProps<T>) {
  const classes = useStyles();

  let searchBoxLabel = '';
  if (searchable) {
    searchBoxLabel = `Search ${labelPlural || label}`;
  } else {
    if (multiple) searchBoxLabel = `Select ${labelPlural || label}`;
    else searchBoxLabel = `Select a ${label}`;
  }
  let SearchBoxIcon = SearchIcon;

  return (
    <>
      <Autocomplete
        noOptionsText={`No ${labelPlural || label || 'options'}`}
        renderOption={(option, { selected }) => {
          let Icon: typeof CheckBoxIcon = CheckBoxOutlineBlankIcon;
          if (multiple) {
            if (selected) Icon = CheckBoxIcon;
            else Icon = CheckBoxOutlineBlankIcon;
          } else {
            if (selected) Icon = RadioButtonCheckedIcon;
            else Icon = RadioButtonUncheckedIcon;
          }

          return (
            <>
              <Icon className={classes.optionIcon} />
              {itemRenderer ? itemRenderer(option, selected) : option.label}
            </>
          );
        }}
        getOptionDisabled={option => !!option.disabled}
        // Override filterOptions prop to allow user to add an option
        filterOptions={
          searchable
            ? // If searchable, use normal filter method
              ((undefined as unknown) as () => Option<T>[])
            : // If not searchable, always show all options
              () => options
        }
        {...AutocompleteProps}
        // This component is only mounted when the popup is open, so always show this
        open
        // A portal is created by the Select component (inside root component)
        disablePortal
        // Set to multiple by default in the function signature
        multiple={multiple}
        options={options}
        value={value as any}
        onChange={onChange as any}
        // onChange={onChange}
        // Cannot set `onClose` here, otherwise tabbing out of search box will
        // cause entire popup to close. This is set in the `handleBlur` prop
        // of the `input` element itself: https://github.com/mui-org/material-ui/blob/master/packages/material-ui-lab/src/useAutocomplete/useAutocomplete.js#L742
        // onClose={onClose}
        // disableCloseOnSelect={!multiple}
        classes={{
          root: clsx(classes.root, !searchable && classes.hideSearch),
          paper: classes.paper,
          popper: classes.popper,
          popperDisablePortal: classes.popperDisablePortal,
          listbox: clsx(
            classes.listbox,
            !searchable && classes.hideSearch,
            !multiple && !clearable && classes.noFooter,
            freeText && classes.freeText
          ),
          option: classes.option,
          noOptions: classes.noOptions,
          ...AutocompleteProps?.classes,
        }}
        // Prevent creation of extra wrapping `div`s
        PaperComponent={FragmentWrapper as any}
        PopperComponent={FragmentWrapper}
        // Prevent search box from rendering the selected items
        renderTags={() => null}
        getOptionLabel={option => option.label}
        getOptionSelected={(option, value) => option.value === value.value}
        // Render search box
        renderInput={params => (
          <TextField
            {...params}
            autoFocus
            onKeyDown={e => {
              // Escape key: close popup. Must be handled here since we cannot
              // pass the `onClose` prop to the root Autocomplete component.
              if (e.key === 'Escape') onClose();
            }}
            variant="filled"
            margin="dense"
            label={searchBoxLabel}
            className={classes.search}
            {...(SearchBoxProps as any)}
            ref={params.InputProps.ref}
            inputProps={
              searchable
                ? { ...params.inputProps, ...SearchBoxProps?.inputProps }
                : // If not searchable, prevent user typing in this box
                  {
                    ...params.inputProps,
                    ...SearchBoxProps?.inputProps,
                    value: '',
                  }
            }
            InputProps={{
              disableUnderline: true,
              classes: { root: classes.searchInput },
              endAdornment: (
                <InputAdornment position="end">
                  <SearchBoxIcon
                    color="action"
                    style={{ pointerEvents: 'none' }}
                  />
                </InputAdornment>
              ),
              ...SearchBoxProps?.InputProps,
            }}
            InputLabelProps={{
              classes: {
                root: classes.searchLabel,
                shrink: classes.searchLabelShrink,
              },
              ...SearchBoxProps?.InputLabelProps,
            }}
          />
        )}
        // Prevent search box resetting when out of focus
        clearOnBlur={false}
      />

      {freeText && (
        <AddItem
          multiple={multiple}
          value={value as any}
          onChange={onChange as any}
          AddButtonProps={AddButtonProps}
        />
      )}

      <PopupFooter
        multiple={multiple}
        selectAll={selectAll}
        clearable={clearable}
        onSelectAll={onSelectAll}
        onClear={onClear}
        onClose={onClose}
        countText={countText}
        value={value}
        options={options}
      />
    </>
  );
}
