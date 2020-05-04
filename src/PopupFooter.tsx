import React from 'react';

import {
  makeStyles,
  createStyles,
  Grid,
  Typography,
  Button,
} from '@material-ui/core';

export const FOOTER_HEIGHT = 48;

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      width: '100%',
      height: FOOTER_HEIGHT,
      margin: 0,
      '& > div': { padding: theme.spacing(0, 1) + ' !important' },
    },

    count: {
      marginLeft: theme.spacing(1),
      fontFeatureSettings: '"tnum"',
      color: theme.palette.text.disabled,
      userSelect: 'none',
    },

    button: { display: 'flex' },
  })
);

export interface IPopupFooterProps {
  multiple: boolean;
  selectAll: boolean;
  clearable: boolean;
  onSelectAll: () => void;
  onClear: () => void;
  onClose: () => void;
  value: any;
  options: any[];
}

export default function PopupFooter({
  multiple,
  selectAll,
  clearable,
  onSelectAll,
  onClear,
  onClose,
  value,
  options,
}: IPopupFooterProps) {
  const classes = useStyles();

  const clearButton = (
    <Button
      onClick={onClear}
      className={classes.button}
      disabled={!value || value?.length === 0}
    >
      Clear
    </Button>
  );

  if (multiple)
    return (
      <Grid
        container
        spacing={2}
        className={classes.root}
        justify="space-between"
        alignItems="center"
      >
        <Grid item>
          <Typography variant="button" className={classes.count}>
            {value.length} of {options.length}
          </Typography>
        </Grid>
        {selectAll ? (
          <Grid item xs>
            {value.length > 0 ? (
              clearButton
            ) : (
              <Button onClick={onSelectAll} className={classes.button}>
                Select All
              </Button>
            )}
          </Grid>
        ) : (
          clearable && (
            <Grid item xs>
              {clearButton}
            </Grid>
          )
        )}

        <Grid item>
          <Button onClick={onClose} className={classes.button}>
            Done
          </Button>
        </Grid>
      </Grid>
    );

  if (clearable)
    return (
      <Grid
        container
        spacing={2}
        className={classes.root}
        justify="space-between"
        alignItems="baseline"
      >
        <Grid item>{clearButton}</Grid>
      </Grid>
    );

  return null;
}
