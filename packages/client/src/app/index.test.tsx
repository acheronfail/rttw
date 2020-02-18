import { render } from '@testing-library/react';
import React from 'react';
import App from './index';

test('renders learn react link', () => {
  const urlParams = new URLSearchParams();
  const { getByText } = render(<App urlParams={urlParams} />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
