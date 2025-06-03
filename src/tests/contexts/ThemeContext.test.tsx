import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../../contexts/ThemeContext';

describe('ThemeContext', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    
    // Reset the document classes
    document.documentElement.className = '';
  });

  const TestComponent = () => {
    const { theme, toggleTheme } = useTheme();
    return (
      <div>
        <span data-testid="theme">{theme}</span>
        <button onClick={toggleTheme}>Toggle Theme</button>
      </div>
    );
  };

  it('provides default theme based on system preference', () => {
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
    }));

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    expect(document.documentElement).toHaveClass('dark');
  });

  it('toggles theme when button is clicked', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const initialTheme = screen.getByTestId('theme').textContent;
    fireEvent.click(screen.getByText('Toggle Theme'));
    
    const newTheme = screen.getByTestId('theme').textContent;
    expect(newTheme).not.toBe(initialTheme);
    expect(document.documentElement).toHaveClass(newTheme as string);
  });

  it('persists theme in localStorage', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByText('Toggle Theme'));
    const theme = screen.getByTestId('theme').textContent;
    
    expect(localStorage.getItem('theme')).toBe(theme);
  });

  it('throws error when useTheme is used outside provider', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => render(<TestComponent />)).toThrow('useTheme must be used within a ThemeProvider');
    
    consoleError.mockRestore();
  });
});