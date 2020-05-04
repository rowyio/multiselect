import * as React from 'react';

/**
 * Wrapper around `PopupContents`. Prevents the creation of an unnecessary
 * wrapping `div` with `role="option" tabIndex="0"`. Allows the user to tab out
 * to exit the popup.
 */
const PopupWrapper = React.forwardRef<any, { children: React.ReactNode }>(
  function PopupWrapper({ children }, _) {
    return <>{children}</>;
  }
);

export default PopupWrapper;
