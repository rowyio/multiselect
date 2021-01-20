import React, { useState } from 'react';

import {
  makeStyles,
  createStyles,
  Button,
  Dialog,
  Grow,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';

import AddCircleIcon from '@material-ui/icons/AddCircle';
import AddBoxIcon from '@material-ui/icons/AddBox';

import { AddItemProps } from './props';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Grow ref={ref} {...props} />;
});

const useStyles = makeStyles(theme =>
  createStyles({
    root: { margin: theme.spacing(0.75) },

    startIcon: {
      marginLeft: -1,
      marginRight: theme.spacing(2),
    },
    iconSizeMedium: {
      '& > *:first-child': { fontSize: 24 },
    },
  })
);

export default function AddItem({
  multiple,
  value,
  onChange,
  AddButtonProps,
  AddDialogProps,
  disabled = false,
}: AddItemProps) {
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  const [toAdd, setToAdd] = useState('');
  const handleAdd = () => {
    if (multiple)
      onChange(
        {} as any,
        [
          ...((Array.isArray(value) ? value : []) as any),
          { value: toAdd, label: toAdd },
        ] as any,
        'create-option'
      );
    else
      onChange(
        {} as any,
        { value: toAdd, label: toAdd } as any,
        'create-option'
      );

    setToAdd('');
    setTimeout(() => setOpen(false));
  };

  return (
    <>
      <Button
        startIcon={multiple ? <AddBoxIcon /> : <AddCircleIcon />}
        color="default"
        classes={classes}
        onClick={() => setOpen(true)}
        disabled={disabled}
        {...AddButtonProps}
      >
        {'\u200b'}
        {AddButtonProps?.children || 'Add New'}
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        TransitionComponent={Transition}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle id="form-dialog-title">
          {AddDialogProps?.title || 'Add Item to List'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            label={AddDialogProps?.textFieldLabel || 'New Item'}
            variant="filled"
            fullWidth
            value={toAdd}
            onChange={e => setToAdd(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleAdd();
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            {AddDialogProps?.cancelButtonLabel || 'Cancel'}
          </Button>
          <Button onClick={handleAdd} color="primary">
            {AddDialogProps?.addButtonLabel || 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
