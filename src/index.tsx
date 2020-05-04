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

interface IMultiSelectCommonProps<T>
  extends Partial<
    Omit<IPopupContentsProps<T>, 'options' | 'value' | 'onChange'>
  > {
  options: (Option<T> | string)[];
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

export type IMultiSelectProps<T> =
  | ({
      multiple?: true;
      value: T[];
      onChange: (value: T[]) => void;
    } & IMultiSelectCommonProps<T>)
  | ({
      multiple: false;
      value: T;
      onChange: (value: T | null) => void;
    } & IMultiSelectCommonProps<T>);

export default function MultiSelect<T = string>({
  options: optionsProp,
  value: valueProp,
  onChange,

  multiple = true,

  backdrop = false,
  ...props
}: // label,
// className,
// TextFieldProps = {},
// displayEmpty,
// backdrop = true,
// ...props
IMultiSelectProps<T>) {
  const { freeText, label } = props;
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

  const handleChange: IPopupContentsProps<T>['onChange'] = (
    _: any,
    newValue: any
  ) => {
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

  const popupContentsProps = multiple
    ? {
        ...props,
        multiple: true as true,
        options,
        value: value as Option<T>[],
        onChange: handleChange,
        onClose: handleClose,
        onSelectAll: handleSelectAll,
        onClear: handleClear,
      }
    : {
        ...props,
        multiple: false as false,
        options,
        value: value as Option<T> | null,
        onChange: handleChange,
        onClose: handleClose,
        onSelectAll: handleSelectAll,
        onClear: handleClear,
      };

  return (
    <TextField
      label={label}
      // Must pass value here to display selected values correctly and shrink label
      // value=""
      // value={
      //   (Array.isArray(valueProp) && valueProp.length > 0) || !!valueProp
      //     ? ['']
      //     : []
      // }
      select
      // value={sanitisedValue}
      // className={clsx(classes.root, className)}
      // {...(TextFieldProps as any)}
      fullWidth
      InputLabelProps={{
        shrink: Array.isArray(valueProp) ? valueProp.length > 0 : !!valueProp,
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
            return '';
          } else {
            return value?.label ?? '';
          }
        },
        // renderValue: value => {
        //   const selected = value as string[];
        //   if (selected.length === 1 && typeof selected[0] === 'string') {
        //     const selectedOption = _find(options, { value: selected[0] });
        //     return selectedOption?.label;
        //   }
        //   return `${selected.length} of ${options.length} selected`;
        // },
        displayEmpty: true,
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
        <PopupContents {...(popupContentsProps as any)} />
      </PopupWrapper>
    </TextField>
  );
}
