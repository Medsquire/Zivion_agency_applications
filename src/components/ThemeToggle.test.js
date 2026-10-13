import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggle from './ThemeToggle';
import { ThemeProvider } from '../context/ThemeContext';

describe('ThemeToggle Component', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    document.body.classList.remove('dark-theme');
  });

  const renderWithTheme = () => {
    return render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );
  };

  test('renders toggle button with initial light mode', () => {
    renderWithTheme();
    const toggleBtn = screen.getByRole('button', {
      name: /Switch to Executive Dark Mode/i,
    });
    expect(toggleBtn).toBeInTheDocument();
  });

  test('clicking toggle switches to dark mode and updates attributes', () => {
    renderWithTheme();
    const toggleBtn = screen.getByRole('button', {
      name: /Switch to Executive Dark Mode/i,
    });

    fireEvent.click(toggleBtn);

    // After click, theme should be dark
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(document.body.classList.contains('dark-theme')).toBe(true);
    expect(localStorage.getItem('bee_portal_theme')).toBe('dark');

    // Button label should now indicate switching back to light mode
    expect(
      screen.getByRole('button', { name: /Switch to Light Mode/i })
    ).toBeInTheDocument();
  });

  test('toggling twice returns to light mode', () => {
    renderWithTheme();
    const toggleBtn = screen.getByRole('button', {
      name: /Switch to Executive Dark Mode/i,
    });

    // To dark
    fireEvent.click(toggleBtn);
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

    // Back to light
    fireEvent.click(toggleBtn);
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(document.body.classList.contains('dark-theme')).toBe(false);
  });
});
