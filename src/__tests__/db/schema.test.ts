// src/__tests__/db/schema.test.ts
import { advocateSchema } from '@/db/schema';
import { z } from 'zod';

describe('Advocate Schema Validation', () => {
  const validAdvocate = {
    firstName: 'John',
    lastName: 'Doe',
    city: 'New York',
    degree: 'Ph.D.',
    specialties: ['Specialty 1', 'Specialty 2'],
    yearsOfExperience: 5,
    phoneNumber: 1234567890
  };

  it('validates correct advocate data', () => {
    const result = advocateSchema.safeParse(validAdvocate);
    expect(result.success).toBe(true);
  });

  it('requires firstName', () => {
    const invalidAdvocate = { ...validAdvocate, firstName: '' };
    const result = advocateSchema.safeParse(invalidAdvocate);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('firstName');
    }
  });

  it('requires lastName', () => {
    const invalidAdvocate = { ...validAdvocate, lastName: '' };
    const result = advocateSchema.safeParse(invalidAdvocate);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('lastName');
    }
  });

  it('requires city', () => {
    const invalidAdvocate = { ...validAdvocate, city: '' };
    const result = advocateSchema.safeParse(invalidAdvocate);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('city');
    }
  });

  it('requires degree', () => {
    const invalidAdvocate = { ...validAdvocate, degree: '' };
    const result = advocateSchema.safeParse(invalidAdvocate);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('degree');
    }
  });

  it('validates specialties as an array of strings', () => {
    const invalidAdvocate = { 
      ...validAdvocate, 
      specialties: ['Valid', 123, null] // invalid types
    };
    const result = advocateSchema.safeParse(invalidAdvocate);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('specialties');
    }
  });

  it('requires positive integer for yearsOfExperience', () => {
    const invalidAdvocate = { ...validAdvocate, yearsOfExperience: -1 };
    const result = advocateSchema.safeParse(invalidAdvocate);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('yearsOfExperience');
    }
  });

  it('requires positive integer for phoneNumber', () => {
    const invalidAdvocate = { ...validAdvocate, phoneNumber: -1234567890 };
    const result = advocateSchema.safeParse(invalidAdvocate);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('phoneNumber');
    }
  });

  it('rejects invalid phone number format', () => {
    const invalidAdvocate = { ...validAdvocate, phoneNumber: 123 }; // too short
    const result = advocateSchema.safeParse(invalidAdvocate);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('phoneNumber');
    }
  });
});