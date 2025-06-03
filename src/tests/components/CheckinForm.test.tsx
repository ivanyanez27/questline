import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CheckInForm } from '../../components/CheckInForm';
import { JourneyProvider } from '../../contexts/JourneyContext';

// Mock the useJourney hook
vi.mock('../../contexts/JourneyContext', () => ({
  useJourney: () => ({
    createCheckIn: vi.fn().mockResolvedValue({ data: {}, error: null }),
  }),
  JourneyProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('CheckInForm', () => {
  const defaultProps = {
    journeyId: '123',
    day: 1,
    theme: 'fantasy',
    onComplete: vi.fn(),
  };

  it('renders form fields correctly', () => {
    render(<CheckInForm {...defaultProps} />);
    
    expect(screen.getByLabelText(/Text Input/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Numeric Input/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Photo Upload/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Daily Reflection/i)).toBeInTheDocument();
  });

  it('validates minimum reflection length', async () => {
    render(<CheckInForm {...defaultProps} />);
    
    const submitButton = screen.getByRole('button', { name: /Complete Check-in/i });
    expect(submitButton).toBeDisabled();

    const reflectionInput = screen.getByLabelText(/Daily Reflection/i);
    await userEvent.type(reflectionInput, 'Short reflection');
    expect(submitButton).toBeDisabled();

    await userEvent.type(reflectionInput, ' '.repeat(50));
    expect(submitButton).toBeEnabled();
  });

  it('handles file upload correctly', async () => {
    render(<CheckInForm {...defaultProps} />);
    
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const input = screen.getByLabelText(/Photo Upload/i) as HTMLInputElement;
    
    await userEvent.upload(input, file);
    
    expect(input.files?.[0]).toBe(file);
    expect(screen.getByText('test.jpg')).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    const onComplete = vi.fn();
    render(<CheckInForm {...defaultProps} onComplete={onComplete} />);
    
    await userEvent.type(screen.getByLabelText(/Text Input/i), 'Test input');
    await userEvent.type(screen.getByLabelText(/Numeric Input/i), '5');
    await userEvent.type(screen.getByLabelText(/Daily Reflection/i), 'This is a detailed reflection about my progress today. I feel great about my achievements.');
    
    const submitButton = screen.getByRole('button', { name: /Complete Check-in/i });
    await userEvent.click(submitButton);
    
    await waitFor(() => {
      expect(onComplete).toHaveBeenCalled();
    });
  });

  it('shows error state for invalid file types', async () => {
    render(<CheckInForm {...defaultProps} />);
    
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByLabelText(/Photo Upload/i);
    
    await userEvent.upload(input, file);
    
    expect(screen.getByText(/Only JPG and PNG files are allowed/i)).toBeInTheDocument();
  });
});