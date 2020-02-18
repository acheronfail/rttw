import { base, ThemeType } from 'grommet';
import { deepMerge } from 'grommet/utils';

// TODO: update themes, for some examples:
// https://github.com/atanasster/grommet-controls/blob/master/src/themes/black.ts

export interface ThemeColors {
  background: string;
  boxShadow: string;
  border: string;
}

// Base theme.

const appBase: ThemeType = {
  global: {
    font: {
      // TODO fallback fonts
      family: 'Ubuntu',
      size: '18px',
      height: '20px',
    },
  },
  button: {
    border: {
      radius: '6px',
    },
  },
  layer: {
    border: {
      radius: '12px',
    },
  },
};

// Light theme.

const lightColors: ThemeColors = {
  background: '#ffffff',
  boxShadow: 'rgba(255, 255, 255, 0.40)',
  border: 'rgba(0, 0, 0, 0.33)',
};

const lightBase: ThemeType = {
  global: {
    colors: {
      brand: '#228be6',
    },
  },
};

// Dark theme.

const darkColors: ThemeColors = {
  background: '#343638',
  boxShadow: 'rgba(0, 0, 0, 0.60)',
  border: '#000000',
};

const darkBase: ThemeType = {
  global: {
    drop: {
      background: darkColors.background,
    },
    elevation: {
      dark: {
        none: 'none',
        xsmall: `0px 2px 2px ${darkColors.boxShadow}`,
        small: `0px 4px 4px ${darkColors.boxShadow}`,
        medium: `0px 6px 8px ${darkColors.boxShadow}`,
        large: `0px 8px 16px ${darkColors.boxShadow}`,
        xlarge: `0px 12px 24px ${darkColors.boxShadow}`,
      },
    },
    colors: {
      active: {
        light: '#3a82b1',
        dark: '#52b7f9',
      },
      background: darkColors.background,
      brand: 'rgb(32, 32, 32)',
      focus: '#ff4081',
      border: darkColors.border,
      control: {
        dark: '#f8f8f8',
        light: darkColors.background,
      },
    },
    hover: {
      background: {
        light: '#dddddd',
        dark: '#222222',
      },
      color: {
        light: '#333333',
        dark: '#ffffff',
      },
    },
  },
  layer: {
    background: 'dark-2',
  },
};

export const light = deepMerge(deepMerge(base, appBase), lightBase);
export const dark = deepMerge(deepMerge(base, appBase), darkBase);
export function getColor(darkMode: boolean, color: keyof ThemeColors) {
  return (darkMode ? darkColors : lightColors)[color];
}
