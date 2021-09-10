import { PopupContentsProps } from './PopupContents';
import { ButtonProps } from '@mui/material';

export type AddItemProps = {
  multiple: boolean;
  value: PopupContentsProps<string>['value'];
  onChange: PopupContentsProps<string>['onChange'];
  disabled?: boolean;
  AddButtonProps?: Partial<ButtonProps>;
  AddDialogProps?: {
    title?: React.ReactNode;
    textFieldLabel?: React.ReactNode;
    cancelButtonLabel?: React.ReactNode;
    addButtonLabel?: React.ReactNode;
  };
};
