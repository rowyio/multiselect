export type PopupFooterProps = {
  multiple: boolean;
  selectAll: boolean;
  clearable: boolean;
  onSelectAll: () => void;
  onClear: () => void;
  onClose: () => void;
  value: any;
  options: any[];
};
