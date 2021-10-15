import React, { useState } from 'react';

import { makeStyles, createStyles } from '@mui/styles';
import {
  useThemeProps,
  Button,
  Dialog,
  Grow,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import AddBoxIcon from '@mui/icons-material/AddBox';

import { AddItemProps } from './props';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Grow ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      margin: theme.spacing(1, 0.75, 0),
    },

    startIcon: {
      marginLeft: theme.spacing(-0.25),
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

  const themeProps: any = useThemeProps({ props: {}, name: 'RowyMultiSelect' });
  const addSingleIcon = AddButtonProps?.singleIcon ??
    themeProps.AddButtonProps?.singleIcon ?? <AddCircleIcon />;
  const addMultipleIcon = AddButtonProps?.multipleIcon ??
    themeProps.AddButtonProps?.multipleIcon ?? <AddBoxIcon />;

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
        'createOption'
      );
    else
      onChange(
        {} as any,
        { value: toAdd, label: toAdd } as any,
        'createOption'
      );

    setToAdd('');
    setTimeout(() => setOpen(false));
  };

  return (
    <>
      <Button
        startIcon={multiple ? addMultipleIcon : addSingleIcon}
        color="secondary"
        variant="text"
        classes={classes}
        onClick={() => setOpen(true)}
        disabled={disabled}
        {...(AddButtonProps as any)}
        sx={{ '&:last-child': { mb: 1 }, ...AddButtonProps?.sx }}
      >
        {'\u200b'}
        {AddButtonProps?.children || 'Add new…'}
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
          {AddDialogProps?.title || 'Add item to list'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            label={AddDialogProps?.textFieldLabel || 'New item'}
            variant="filled"
            fullWidth
            value={toAdd}
            onChange={(e) => setToAdd(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAdd();
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>
            {AddDialogProps?.cancelButtonLabel || 'Cancel'}
          </Button>
          <Button onClick={handleAdd} color="primary" variant="contained">
            {AddDialogProps?.addButtonLabel || 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
