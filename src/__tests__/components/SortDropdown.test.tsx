// src/__tests__/components/SortDropdown.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import SortDropdown from '@/components/SortDropdown';

describe('SortDropdown', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders with default value', () => {
    render(<SortDropdown value="default" onChange={mockOnChange} />);
    expect(screen.getByText('Sort: Default')).toBeInTheDocument();
  });

  it('shows options when clicked', () => {
    render(<SortDropdown value="default" onChange={mockOnChange} />);
    
    fireEvent.click(screen.getByRole('button'));
    
    expect(screen.getByText('Name (A-Z)')).toBeInTheDocument();
    expect(screen.getByText('Name (Z-A)')).toBeInTheDocument();
    expect(screen.getByText('Most experienced')).toBeInTheDocument();
    expect(screen.getByText('Newly certified')).toBeInTheDocument();
  });

  it('calls onChange when option is selected', () => {
    render(<SortDropdown value="default" onChange={mockOnChange} />);
    
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Name (A-Z)'));
    
    expect(mockOnChange).toHaveBeenCalledWith('name-asc');
  });

  it('closes dropdown after selection', () => {
    render(<SortDropdown value="default" onChange={mockOnChange} />);
    
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Name (A-Z)'));
    
    expect(screen.queryByText('Name (Z-A)')).not.toBeInTheDocument();
  });

  it('highlights selected option', () => {
    render(<SortDropdown value="name-asc" onChange={mockOnChange} />);
    
    fireEvent.click(screen.getByRole('button'));
    
    const selectedOption = screen.getByText('Name (A-Z)');
    expect(selectedOption.closest('li')).toHaveClass('bg-blue-50 text-blue-700');
  });

  it('closes when clicking outside', () => {
    render(<SortDropdown value="default" onChange={mockOnChange} />);
    
    fireEvent.click(screen.getByRole('button'));
    fireEvent.mouseDown(document.body);
    
    expect(screen.queryByText('Name (A-Z)')).not.toBeInTheDocument();
  });
});