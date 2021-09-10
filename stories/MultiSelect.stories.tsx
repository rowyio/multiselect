import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';

import { createTheme, ThemeProvider } from '@mui/material';

import MultiSelect from '../src';
import { top100Films } from './data';

const theme = createTheme();

export default {
  title: 'MultiSelect',
  component: MultiSelect,
  decorators: [
    (storyFn) => (
      <ThemeProvider theme={theme}>
        <div style={{ maxWidth: 600, margin: '40px auto' }}>{storyFn()}</div>
      </ThemeProvider>
    ),
  ],
  args: {
    label: 'Movie',
    labelPlural: 'Movies',
    empty: false,
    options: top100Films,
    disabled: false,
    searchable: true,
    freeText: false,
    selectAll: true,
    clearable: true,
  },
};

export const Multiple = (args) => {
  const [value, setValue] = useState<string[]>(['The Godfather']);

  const handleChange = (value, reason) => {
    setValue(value);
    action('Value changed')(value, reason);
  };

  return (
    <MultiSelect
      {...args}
      options={args.empty ? [] : args.options}
      value={value}
      onChange={handleChange}
      onOpen={action('Opened')}
      onClose={action('Closed')}
    />
  );
};
Multiple.args = { max: 3 };

export const Single = (args) => {
  const [value, setValue] = useState<string>('The Godfather');

  const handleChange = (value, reason) => {
    setValue(value);
    action('Value changed')(value, reason);
  };

  return (
    <MultiSelect
      {...args}
      options={args.empty ? [] : args.options}
      multiple={false}
      value={value}
      onChange={handleChange}
      onOpen={action('Opened')}
      onClose={action('Closed')}
    />
  );
};
