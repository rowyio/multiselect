import React from 'react';
import clsx from 'clsx';

import {
  makeStyles,
  createStyles,
  TextField,
  InputAdornment,
} from '@material-ui/core';
import Autocomplete, {
  createFilterOptions,
} from '@material-ui/lab/Autocomplete';

import SearchIcon from '@material-ui/icons/Search';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';

import PopupWrapper from './PopupWrapper';
import PopupFooter from './PopupFooter';

import { PopupContentsProps, Option } from './constants/props';
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

    listbox: {
      boxSizing: 'border-box',
      minHeight: LISTBOX_MIN_HEIGHT,
      maxHeight: `calc(100vh - 96px - ${SEARCH_AREA_HEIGHT}px - ${FOOTER_HEIGHT}px)`,

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

const filter = createFilterOptions<Option<any>>();

export default function PopupContents<T>({
  onClose,
  onSelectAll,
  onClear,

  labelPlural,
  label,

  multiple,
  searchable = true,
  selectAll = true,
  clearable = false,
  freeText = false,

  itemRenderer,
  SearchBoxProps,
  ...props
}: PopupContentsProps<T>) {
  const { options, value } = props;
  const classes = useStyles();

  let searchBoxLabel = '';
  if (searchable) {
    if (freeText)
      searchBoxLabel = `Search ${labelPlural ?? label} or Add a New ${label}`;
    else searchBoxLabel = `Search ${labelPlural ?? label}`;
  } else {
    if (multiple) searchBoxLabel = `Select ${labelPlural ?? label}`;
    else searchBoxLabel = `Select a ${label}`;
  }
  let SearchBoxIcon = SearchIcon;

  return (
    <>
      <Autocomplete
        noOptionsText={`No ${labelPlural ?? label ?? 'options'}`}
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
        {...props}
        // This component is only mounted when the popup is open, so always show this
        open
        // A portal is created by the Select component (inside root component)
        disablePortal
        // Set to multiple by default in the function signature
        multiple={multiple as any}
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
            !multiple && !clearable && classes.noFooter
          ),
          option: classes.option,
          noOptions: classes.noOptions,
          ...props.classes,
        }}
        // Prevent creation of extra wrapping `div`s
        PaperComponent={PopupWrapper as any}
        PopperComponent={PopupWrapper}
        // Prevent search box from rendering the selected items
        renderTags={() => null}
        getOptionLabel={option => option.label}
        getOptionSelected={(option, value) => option.value === value.value}
        // Render search box
        renderInput={params => (
          <TextField
            autoFocus
            onKeyDown={e => {
              // Escape key: close popup. Must be handled here since we cannot
              // pass the `onClose` prop to the root `Autocomplete` component.
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
          />
        )}
        // Prevent search box resetting when out of focus
        clearOnBlur={false}
        // Override filterOptions prop to allow user to add an option
        filterOptions={
          searchable
            ? // If freeText, show Add value option
              freeText
              ? (options, params) => {
                  const filtered = filter(options, params) as Option<any>[];

                  // Suggest the creation of a new value
                  if (
                    params.inputValue !== '' &&
                    filtered.findIndex(
                      option => option.value === params.inputValue
                    ) <= -1
                  )
                    filtered.push({
                      value: params.inputValue,
                      label: `Add “${params.inputValue}”`,
                    });

                  return filtered;
                }
              : // If searchable but not freeText, use normal filter method
                ((undefined as unknown) as () => Option<T>[])
            : // If not searchable, always show all options
              () => options
        }
      />

      <PopupFooter
        multiple={multiple}
        selectAll={selectAll}
        clearable={clearable}
        onSelectAll={onSelectAll}
        onClear={onClear}
        onClose={onClose}
        value={value}
        options={options}
      />
    </>
  );
}
