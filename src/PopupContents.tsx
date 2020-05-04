import React from 'react';

import {
  makeStyles,
  createStyles,
  TextField,
  InputAdornment,
  Grid,
  Typography,
  Button,
} from '@material-ui/core';
import Autocomplete, { AutocompleteProps } from '@material-ui/lab/Autocomplete';
import { UseAutocompleteMultipleProps } from '@material-ui/lab/useAutocomplete';

import SearchIcon from '@material-ui/icons/Search';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
// import AddIcon from '@material-ui/icons/Add'

export const SEARCH_AREA_HEIGHT = 16 + 48 + 8;
export const LISTBOX_MIN_HEIGHT = 100;
export const FOOTER_HEIGHT = 48;

const useStyles = makeStyles(theme =>
  createStyles({
    paper: { margin: 0 },
    popper: { minWidth: '100%' },
    popperDisablePortal: { position: 'relative' },

    search: {
      margin: theme.spacing(2, 2, 1),
      width: `calc(100% - ${theme.spacing(2 * 2)}px)`,
    },
    searchInput: { borderRadius: theme.shape.borderRadius },

    listbox: {
      padding: 0,
      minHeight: LISTBOX_MIN_HEIGHT,
      maxHeight: `calc(100vh - 96px - ${SEARCH_AREA_HEIGHT}px - ${FOOTER_HEIGHT}px)`,
    },

    option: {
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

    footer: {
      width: '100%',
      margin: theme.spacing(-2 / 8, 0),
    },
    count: {
      marginLeft: theme.spacing(1),
      fontFeatureSettings: '"tnum"',
      color: theme.palette.text.disabled,
    },
    footerButton: { display: 'flex' },
  })
);

export type Option<T> = {
  value: T;
  label: string;
  disabled?: boolean;
};

export interface IPopupContentsProps<T>
  extends Partial<
    AutocompleteProps<Option<T>> & UseAutocompleteMultipleProps<Option<T>>
  > {
  options: Option<T>[];
  value: any;
  onClose: () => void;
  onSelectAll: () => void;
  onClear: () => void;

  label?: string;
  labelPlural?: string;
}

export default function PopupContents<T>({
  onClose,
  onSelectAll,
  onClear,
  label,
  labelPlural,
  ...props
}: IPopupContentsProps<T>) {
  const classes = useStyles();

  return (
    <>
      <Autocomplete
        {...props}
        open
        // Cannot set `onClose` here, otherwise tabbing out of search box will
        // cause entire popup to close. This is set in the `handleBlur` prop
        // of the `input` element itself: https://github.com/mui-org/material-ui/blob/master/packages/material-ui-lab/src/useAutocomplete/useAutocomplete.js#L742
        // onClose={onClose}
        multiple
        classes={{
          paper: classes.paper,
          popper: classes.popper,
          popperDisablePortal: classes.popperDisablePortal,
          listbox: classes.listbox,
          option: classes.option,
        }}
        // disableCloseOnSelect
        disablePortal
        PaperComponent={props => (
          <div {...props} onClick={e => e.stopPropagation()} />
        )}
        PopperComponent={props => (
          <div {...props} onClick={e => e.stopPropagation()} />
        )}
        renderTags={() => null}
        // noOptionsText="No labels"
        renderOption={(option, { selected }) => {
          let Icon: typeof CheckBoxIcon = CheckBoxOutlineBlankIcon;
          if (true) {
            if (selected) Icon = CheckBoxIcon;
            else Icon = CheckBoxOutlineBlankIcon;
          } else {
            if (selected) Icon = RadioButtonCheckedIcon;
            else Icon = RadioButtonUncheckedIcon;
          }

          return (
            <>
              <Icon className={classes.optionIcon} />
              {option.label}
            </>
          );
        }}
        // options={[...labels].sort((a, b) => {
        //   // Display the selected labels first.
        //   let ai = value.indexOf(a);
        //   ai = ai === -1 ? value.length + labels.indexOf(a) : ai;
        //   let bi = value.indexOf(b);
        //   bi = bi === -1 ? value.length + labels.indexOf(b) : bi;
        //   return ai - bi;
        // })}
        getOptionLabel={option => option.label}
        getOptionSelected={(option, value) => option.value === value.value}
        renderInput={params => (
          <TextField
            ref={params.InputProps.ref}
            inputProps={params.inputProps}
            autoFocus
            onKeyDown={e => {
              // Escape key: close popup. Must be handled here since we cannot
              // pass the `onClose` prop to the root `Autocomplete` component.
              if (e.key === 'Escape') onClose();
            }}
            variant="filled"
            margin="dense"
            label={`Search ${labelPlural ?? label}`}
            className={classes.search}
            InputProps={{
              disableUnderline: true,
              classes: { root: classes.searchInput },
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon
                    color="action"
                    style={{ pointerEvents: 'none' }}
                  />
                </InputAdornment>
              ),
            }}
          />
        )}
      />

      <Grid
        container
        spacing={2}
        className={classes.footer}
        justify="space-between"
        alignItems="baseline"
      >
        <Grid item>
          <Typography variant="button" className={classes.count}>
            {props.value.length} of {props.options.length}
          </Typography>
        </Grid>
        <Grid item xs>
          {props.value.length > 1 ? (
            <Button onClick={onClear} className={classes.footerButton}>
              Clear
            </Button>
          ) : (
            <Button onClick={onSelectAll} className={classes.footerButton}>
              Select All
            </Button>
          )}
        </Grid>

        <Grid item>
          <Button onClick={onClose} className={classes.footerButton}>
            Done
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
