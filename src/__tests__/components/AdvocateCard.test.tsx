// src/__tests__/components/AdvocateCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdvocateCard from '@/components/AdvocateCard';

describe('AdvocateCard', () => {
  const mockAdvocate = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    city: 'New York',
    degree: 'Ph.D.',
    specialties: ['Specialty 1', 'Specialty 2', 'Specialty 3', 'Specialty 4'],
    yearsOfExperience: 5,
    phoneNumber: 1234567890,
    createdAt: new Date().toISOString() 
  };

  it('renders basic advocate information correctly', () => {
    render(<AdvocateCard advocate={mockAdvocate} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Ph.D.')).toBeInTheDocument();
    expect(screen.getByText('New York')).toBeInTheDocument();
    expect(screen.getByText('5 years experience')).toBeInTheDocument();
  });

  it('shows initials in avatar', () => {
    render(<AdvocateCard advocate={mockAdvocate} />);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('handles show more/less for specialties correctly', () => {
    render(<AdvocateCard advocate={mockAdvocate} />);
    
    // initially shows only 3 specialties and a "+1 more" indicator
    expect(screen.getByText('Specialty 1')).toBeInTheDocument();
    expect(screen.getByText('Specialty 2')).toBeInTheDocument();
    expect(screen.getByText('Specialty 3')).toBeInTheDocument();
    expect(screen.getByText('+1 more')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Show more'));
    
    // should now showall specialties
    expect(screen.getByText('Specialty 4')).toBeInTheDocument();
    expect(screen.queryByText('+1 more')).not.toBeInTheDocument();
  });

  it('formats phone number correctly', () => {
    render(<AdvocateCard advocate={mockAdvocate} />);
    
    // click "Show more" to reveal phone number
    fireEvent.click(screen.getByText('Show more'));
    
    expect(screen.getByText('(123) 456-7890')).toBeInTheDocument();
  });

  it('handles singular year of experience correctly', () => {
    const singleYearAdvocate = {
      ...mockAdvocate,
      yearsOfExperience: 1
    };
    
    render(<AdvocateCard advocate={singleYearAdvocate} />);
    expect(screen.getByText('1 year experience')).toBeInTheDocument();
  });
});