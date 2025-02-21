// src/__tests__/components/SearchInput.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import SearchInput from '@/components/SearchInput';

describe('SearchInput', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders with default placeholder', () => {
    render(<SearchInput value="" onChange={mockOnChange} />);
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  it('renders with custom placeholder', () => {
    render(<SearchInput value="" onChange={mockOnChange} placeholder="Custom placeholder" />);
    expect(screen.getByPlaceholderText('Custom placeholder')).toBeInTheDocument();
  });

  it('shows helper text when provided', () => {
    render(
      <SearchInput 
        value="" 
        onChange={mockOnChange} 
        helperText="Test helper text" 
      />
    );
    expect(screen.getByText('Test helper text')).toBeInTheDocument();
  });

  it('calls onChange when typing', () => {
    render(<SearchInput value="" onChange={mockOnChange} />);
    
    fireEvent.change(screen.getByPlaceholderText('Search...'), {
      target: { value: 'test' }
    });
    
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it('shows clear button when value exists', () => {
    render(<SearchInput value="test" onChange={mockOnChange} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('clears text when clicking clear button', () => {
    render(<SearchInput value="test" onChange={mockOnChange} />);
    const clearButton = screen.getByRole('button');
    
    fireEvent.click(clearButton);
    
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    const event = mockOnChange.mock.calls[0][0];
    expect(event.target.value).toBe('');
  });

  it('does not show clear button when value is empty', () => {
    render(<SearchInput value="" onChange={mockOnChange} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});