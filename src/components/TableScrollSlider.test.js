import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TableScrollSlider from './TableScrollSlider';
import { ThemeProvider } from '../context/ThemeContext';

describe('TableScrollSlider Component', () => {
  const renderSampleTable = () => {
    return render(
      <ThemeProvider>
        <TableScrollSlider>
        <table data-testid="test-table">
          <thead>
            <tr>
              <th>Col 1</th>
              <th>Col 2</th>
              <th>Col 3</th>
              <th>Col 4</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Val 1</td>
              <td>Val 2</td>
              <td>Val 3</td>
              <td>Val 4</td>
            </tr>
          </tbody>
        </table>
      </TableScrollSlider>
    </ThemeProvider>
  );
  };

  test('renders children table correctly', () => {
    renderSampleTable();
    expect(screen.getByTestId('test-table')).toBeInTheDocument();
  });

  test('renders sliding bar without any text descriptions or container boxes', () => {
    renderSampleTable();
    // Verify no description text is rendered
    expect(screen.queryByText(/Slide table to see all columns/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/viewed/i)).not.toBeInTheDocument();
  });

  test('renders range input sliding bar with accessible label', () => {
    renderSampleTable();
    const rangeInput = screen.getByRole('slider', {
      name: /Slide to move and view total table/i,
    });
    expect(rangeInput).toBeInTheDocument();
    expect(rangeInput).toHaveValue('0');
  });

  test('changing sliding bar value updates value', () => {
    renderSampleTable();
    const rangeInput = screen.getByRole('slider', {
      name: /Slide to move and view total table/i,
    });

    fireEvent.change(rangeInput, { target: { value: '60' } });
    expect(rangeInput.value).toBe('60');
  });

  test('sliding bar is placed below the table in the DOM', () => {
    const { container } = renderSampleTable();
    const tableWrapper = container.querySelector('.table-wrapper');
    const bottomSlider = container.querySelector('.table-bottom-slider');

    expect(tableWrapper).toBeInTheDocument();
    expect(bottomSlider).toBeInTheDocument();

    // Verify bottomSlider is rendered after tableWrapper
    expect(tableWrapper.compareDocumentPosition(bottomSlider) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});
