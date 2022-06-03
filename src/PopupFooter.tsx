import React from 'react';

import { makeStyles } from 'tss-react/mui';
import { Grid, Typography, Button } from '@mui/material';

import { PopupFooterProps } from './props';
import { FOOTER_HEIGHT } from './constants/layout';

const useStyles = makeStyles()((theme) => ({
  root: {
    width: '100%',
    height: FOOTER_HEIGHT,
    margin: 0,

    '& > div': { padding: theme.spacing(0, 1) + ' !important' },
  },

  count: {
    display: 'block',
    marginLeft: theme.spacing(1),

    fontFeatureSettings: '"tnum"',
    color: theme.palette.text.disabled,
    userSelect: 'none',
  },

  button: { display: 'flex' },
}));

export default function PopupFooter({
  multiple,
  selectAll,
  clearable,
  onSelectAll,
  onClear,
  onClose,
  countText,
  value,
  options,
  max,
  clearText,
  selectAllText,
  doneText,
}: PopupFooterProps) {
  const { classes } = useStyles();

  const clearButton = (
    <Button
      onClick={onClear}
      className={classes.button}
      variant="text"
      color="primary"
      disabled={!value || value?.length === 0}
    >
      {clearText}
    </Button>
  );

  if (multiple)
    return (
      <Grid
        container
        spacing={2}
        className={classes.root}
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid item>
          <Typography variant="button" className={classes.count}>
            {countText ??
              `${value.length} of ${options.length}${
                max ? ', max ' + max : ''
              }`}
          </Typography>
        </Grid>
        {selectAll ? (
          <Grid item xs>
            {value.length > 0 && clearable !== false ? (
              clearButton
            ) : (
              <Button
                onClick={onSelectAll}
                className={classes.button}
                variant="text"
                color="primary"
                disabled={value.length > 0}
              >
                {selectAllText}
              </Button>
            )}
          </Grid>
        ) : (
          clearable !== false && (
            <Grid item xs>
              {clearButton}
            </Grid>
          )
        )}

        <Grid item>
          <Button
            onClick={onClose}
            className={classes.button}
            variant="text"
            color="primary"
          >
            {doneText}
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
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid item>{clearButton}</Grid>

        <Grid item>
          <Button
            onClick={onClose}
            className={classes.button}
            variant="text"
            color="primary"
          >
            {doneText}
          </Button>
        </Grid>
      </Grid>
    );

  return null;
}
