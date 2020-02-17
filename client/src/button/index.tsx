import { Box, Button as GrommetButton, ButtonProps as GrommetButtonProps } from 'grommet';
import React, { useRef, useEffect } from 'react';

export interface ButtonProps extends GrommetButtonProps, Omit<JSX.IntrinsicElements['button'], 'color'> {
  label: string;
  focus?: boolean;
}

export function Button({ label, focus, ...props }: ButtonProps) {
  // Focus the button if set.
  const buttonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (focus) {
      setTimeout(() => {
        buttonRef.current?.focus();
      }, 0);
    }
  }, [focus]);

  const innerLabel = <Box pad="xsmall">{label}</Box>;
  return <GrommetButton ref={buttonRef} {...props} label={innerLabel} plain />;
}

export default Button;
