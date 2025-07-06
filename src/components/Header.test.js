import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from './Header';
import { TestWrapper } from '../test-utils';

// Mock axios to prevent ESM import issues
jest.mock('axios');

describe('Header Component Tests', () => {
  test('renders MovieBase header', () => {
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>
    );
    const headerElement = screen.getByText(/MovieBase/i);
    expect(headerElement).toBeInTheDocument();
  });

  test('renders dark mode toggle button', () => {
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>
    );
    const darkModeButton = screen.getByLabelText(/Toggle dark mode/i);
    expect(darkModeButton).toBeInTheDocument();
  });

  test('dark mode toggle works', () => {
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>
    );

    const darkModeButton = screen.getByLabelText(/Toggle dark mode/i);
    fireEvent.click(darkModeButton);

    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  test('dark mode button has proper aria-label', () => {
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>
    );

    const darkModeButton = screen.getByLabelText(/Toggle dark mode/i);
    expect(darkModeButton).toBeInTheDocument();
  });
}); 