import { render, screen } from '@testing-library/react';
import App from './App';

test('renders agency portal sign in', () => {
  render(<App />);
  const headingElement = screen.getByText(/AGENCY/i);
  expect(headingElement).toBeInTheDocument();
});
