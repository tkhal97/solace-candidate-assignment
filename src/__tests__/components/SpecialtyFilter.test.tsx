// src/__tests__/components/SpecialtyFilter.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import SpecialtyFilter from '@/components/SpecialtyFilter';

describe('SpecialtyFilter', () => {
  const mockSpecialties = [
    'Specialty 1',
    'Specialty 2',
    'Specialty 3',
    'Specialty 4',
    'Specialty 5'
  ];

  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders all specialties when list is short', () => {
    render(
      <SpecialtyFilter
        specialties={mockSpecialties}
        selectedSpecialties={[]}
        onChange={mockOnChange}
      />
    );

    mockSpecialties.forEach(specialty => {
      expect(screen.getByText(specialty)).toBeInTheDocument();
    });

    // should not show "Show all" button for short list
    expect(screen.queryByText(/Show all/)).not.toBeInTheDocument();
  });

  it('shows limited specialties with "Show all" button when list is long', () => {
    const longSpecialties = Array.from({ length: 20 }, (_, i) => `Specialty ${i + 1}`);
    
    render(
      <SpecialtyFilter
        specialties={longSpecialties}
        selectedSpecialties={[]}
        onChange={mockOnChange}
      />
    );

    // should initially show only first 10 specialties
    expect(screen.getByText('Specialty 1')).toBeInTheDocument();
    expect(screen.getByText('Specialty 10')).toBeInTheDocument();
    expect(screen.queryByText('Specialty 11')).not.toBeInTheDocument();

    // should show "Show all" button
    expect(screen.getByText(/Show all \(20\)/)).toBeInTheDocument();
  });

  it('toggles specialty selection correctly', () => {
    render(
      <SpecialtyFilter
        specialties={mockSpecialties}
        selectedSpecialties={[]}
        onChange={mockOnChange}
      />
    );

    fireEvent.click(screen.getByText('Specialty 1'));
    expect(mockOnChange).toHaveBeenCalledWith('Specialty 1');
  });

  it('shows selected count when specialties are selected', () => {
    render(
      <SpecialtyFilter
        specialties={mockSpecialties}
        selectedSpecialties={['Specialty 1', 'Specialty 2']}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('specialties selected')).toBeInTheDocument();
  });

  it('toggles between show more and show less for long lists', () => {
    const longSpecialties = Array.from({ length: 20 }, (_, i) => `Specialty ${i + 1}`);
    
    render(
      <SpecialtyFilter
        specialties={longSpecialties}
        selectedSpecialties={[]}
        onChange={mockOnChange}
      />
    );

    fireEvent.click(screen.getByText(/Show all/));

    // should now show all specialties and "Show less" button
    expect(screen.getByText('Specialty 20')).toBeInTheDocument();
    expect(screen.getByText('Show less')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Show less'));

    // should hide specialties beyond 10 again
    expect(screen.queryByText('Specialty 20')).not.toBeInTheDocument();
    expect(screen.getByText(/Show all/)).toBeInTheDocument();
  });

  it('displays correct visual state for selected specialties', () => {
    render(
      <SpecialtyFilter
        specialties={mockSpecialties}
        selectedSpecialties={['Specialty 1']}
        onChange={mockOnChange}
      />
    );

    // selected specialty should have the selected style
    const selectedSpecialty = screen.getByText('Specialty 1').parentElement;
    expect(selectedSpecialty?.querySelector('div')).toHaveClass('bg-blue-600');

    // unselected specialty should have the unselected style
    const unselectedSpecialty = screen.getByText('Specialty 2').parentElement;
    expect(unselectedSpecialty?.querySelector('div')).toHaveClass('border-gray-300');
  });
});