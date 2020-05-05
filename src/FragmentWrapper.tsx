import * as React from 'react';

/**
 * Wrapper around `PopupContents`. Prevents the creation of an unnecessary
 * wrapping `div` with `role="option" tabIndex="0"`. Allows the user to tab out
 * to exit the popup.
 */
const FragmentWrapper = React.forwardRef<any, { children: React.ReactNode }>(
  function FragmentWrapper({ children }, _) {
    return <>{children}</>;
  }
);

export default FragmentWrapper;
