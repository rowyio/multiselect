import React, { useState } from 'react';
// import clsx from 'clsx';
// import _unionWith from 'lodash/unionWith';
// import _find from 'lodash/find';
import {
  makeStyles,
  createStyles,
  TextField,
  // TextFieldProps
} from '@material-ui/core';

// import useStyles from './styles';
import PopupContents, {
  IPopupContentsProps,
  Option,
  SEARCH_AREA_HEIGHT,
  LISTBOX_MIN_HEIGHT,
  FOOTER_HEIGHT,
} from './PopupContents';
import PopupWrapper from './PopupWrapper';

const useStyles = makeStyles(() =>
  createStyles({
    paper: {
      minHeight: SEARCH_AREA_HEIGHT + LISTBOX_MIN_HEIGHT + FOOTER_HEIGHT,
    },
  })
);

export interface IMultiSelectProps<T>
  extends Partial<
    Omit<IPopupContentsProps<T>, 'options' | 'value' | 'onChange'>
  > {
  options: (Option<T> | string)[];
  value: T[];
  onChange: (value: T[]) => void;
  // itemRenderer?: (option: OptionType, isSelected: boolean) => React.ReactNode;
  // /** Optional style overrides for root MUI `TextField` component */
  // className?: string;
  // /** Override any props of the root MUI `TextField` component */
  // TextFieldProps?: Partial<TextFieldProps>;
  // /** Display 0 of X selected when empty */
  // displayEmpty?: boolean;
  /** Show the backdrop when dropdown open */
  backdrop?: boolean;
}

export default function MultiSelect<T = string>({
  options: optionsProp,
  value: valueProp,
  onChange,

  label,

  backdrop = false,
  ...props
}: // label,
// className,
// TextFieldProps = {},
// displayEmpty,
// backdrop = true,
// ...props
IMultiSelectProps<T>) {
  const { freeText, multiple } = props;
  const classes = useStyles();

  // const {
  //   value = [],
  //   searchable = true,
  //   freeText = false,
  //   multiple = true,
  // } = props;

  // const [dropdownWidth, setDropdownWidth] = useState(200);
  // const classes = useStyles({
  //   searchable,
  //   freeText,
  //   multiple,
  //   width: dropdownWidth,
  // });

  // Must control popup open state here to programmatically close it
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Close the popup when tabbing out
  const handlePaperFocus = (e: React.FocusEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) handleClose();
  };

  // const sanitisedValue = value.filter(v => v?.length > 0);

  // Transform `option` prop if it’s just strings
  const options = optionsProp.map(
    item =>
      (typeof item === 'string'
        ? { label: item, value: item }
        : item) as Option<T>
  );

  // Transform `value` to `Option` type
  const value = valueProp
    .map(
      item =>
        (typeof optionsProp[0] === 'string'
          ? { label: item, value: item }
          : options.find(option => option.value === item)) as
          | Option<T>
          | undefined
    )
    .filter(item => item !== undefined) as Option<T>[];

  // If `freeText` enabled, show the user’s custom values
  // at the start of the list
  if (freeText) {
    for (let i = value.length - 1; i >= 0; i--) {
      const item = value[i];
      if (options.findIndex(option => option.value === item.value) <= -1)
        options.unshift(item);
    }
  }

  const handleChange: IPopupContentsProps<T>['onChange'] = (_, newValue) => {
    if (multiple) {
      onChange(newValue.map(item => item.value));
    } else {
      // onChange(newValue.value);
      handleClose();
    }
  };

  const handleSelectAll = () => onChange(options.map(item => item.value));
  const handleClear = () => onChange([]);

  return (
    <TextField
      label={label}
      value=""
      select
      // value={sanitisedValue}
      // className={clsx(classes.root, className)}
      // {...(TextFieldProps as any)}
      fullWidth
      SelectProps={{
        open,
        onOpen: handleOpen,
        onClose: handleClose,
        // renderValue: value => {
        //   const selected = value as string[];
        //   if (selected.length === 1 && typeof selected[0] === 'string') {
        //     const selectedOption = _find(options, { value: selected[0] });
        //     return selectedOption?.label;
        //   }
        //   return `${selected.length} of ${options.length} selected`;
        // },
        // displayEmpty,
        // classes: { root: classes.selectRoot },
        // ...TextFieldProps.SelectProps,
        // Must have this set to prevent MUI transforming `value`
        // prop for this component to a comma-separated string
        // multiple: true,
        MenuProps: {
          classes: { paper: classes.paper },
          MenuListProps: {
            disablePadding: true,
            component: 'div',
            autoFocus: false,
            // Remove listbox role. This is created in the Autocomplete listbox.
            role: '',
            // Allow the user to click and tab between elements inside the
            // popup without closing the popup. Also fixes the “S” bug.
            onKeyDown: () => {},
          } as any,
          // Always display the popup below the main select element.
          getContentAnchorEl: null,
          anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
          transformOrigin: { vertical: 'top', horizontal: 'center' },
          // Allow a backdrop to be rendered via prop
          BackdropProps: { invisible: !backdrop },
          // Allow the user to tab out to close the popup
          PaperProps: { onFocus: handlePaperFocus },
          //   ...TextFieldProps.SelectProps?.MenuProps,
        },
      }}
      // ref={el => {
      //   if (!el) return;
      //   const width = el.getBoundingClientRect().width;
      //   if (dropdownWidth < width) setDropdownWidth(width);
      // }}
    >
      <PopupWrapper>
        <PopupContents
          // dropdownWidth={dropdownWidth}
          {...props}
          options={options}
          value={value}
          onChange={handleChange}
          onClose={handleClose}
          onSelectAll={handleSelectAll}
          onClear={handleClear}
          label={label}
        />
      </PopupWrapper>
    </TextField>
  );
}
