export type PopupFooterProps = {
  multiple: boolean;
  selectAll: boolean;
  clearable: boolean;
  onSelectAll: () => void;
  onClear: () => void;
  onClose: () => void;
  countText?: React.ReactNode;
  value: any;
  options: any[];
  max?: number;
  clearText?: string;
  selectAllText?: string;
  doneText?: string;
};
