// src/__tests__/api/advocates.test.ts
import { NextRequest } from 'next/server';
import type { Advocate } from '@/types/advocate';

const mockAdvocates: Advocate[] = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    city: 'New York',
    degree: 'Ph.D.',
    specialties: ['Specialty 1', 'Specialty 2'],
    yearsOfExperience: 5,
    phoneNumber: 1234567890,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    city: 'Los Angeles',
    degree: 'M.D.',
    specialties: ['Specialty 2', 'Specialty 3'],
    yearsOfExperience: 3,
    phoneNumber: 9876543210,
    createdAt: new Date().toISOString()
  }
];

const mockJson = jest.fn();
const MockResponse = {
  json: mockJson,
  status: 200
};
global.Response = {
  json: (data: any, init?: any) => {
    mockJson.mockReturnValueOnce(Promise.resolve(data));
    return { ...MockResponse, status: init?.status || 200 };
  }
} as any;

// mock the db
jest.mock('@/db', () => ({
  __esModule: true,
  default: {
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockResolvedValue([])
  }
}));

describe('Advocates API', () => {
  let GET: any;
  let dbMock: any;
  let originalConsoleError: typeof console.error;

  beforeAll(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalConsoleError;
  });

  beforeEach(async () => {
    jest.resetModules();
    jest.clearAllMocks();
    const { GET: getFn } = await import('@/app/api/advocates/route');
    GET = getFn;
    dbMock = (await import('@/db')).default;
    dbMock.select.mockReturnThis();
    dbMock.from.mockResolvedValue(mockAdvocates);
  });

  afterEach(() => {
    jest.resetModules();
    mockJson.mockClear();
  });

  it('returns all advocates with default pagination', async () => {
    const request = new NextRequest('http://localhost:3000/api/advocates');
    const response = await GET(request);
    const data = await response.json();

    expect(data.data).toHaveLength(2);
    expect(data.status).toBe('live');
    expect(data.pagination).toEqual({
      total: 2,
      page: 1,
      pageSize: 10,
      totalPages: 1
    });
  });

  it('handles custom pagination', async () => {
    const request = new NextRequest('http://localhost:3000/api/advocates?page=1&pageSize=1');
    const response = await GET(request);
    const data = await response.json();

    expect(data.data).toHaveLength(1);
    expect(data.pagination).toEqual({
      total: 2,
      page: 1,
      pageSize: 1,
      totalPages: 2
    });
  });

  it('filters by specialty correctly', async () => {
    const request = new NextRequest('http://localhost:3000/api/advocates?specialty=Specialty%201');
    const response = await GET(request);
    const data = await response.json();

    expect(data.data).toHaveLength(1);
    expect(data.data[0].firstName).toBe('John');
    expect(data.data[0].specialties).toContain('Specialty 1');
  });

  it('returns error when database fails and no cache exists', async () => {
    jest.resetModules();
    
    const { GET: freshGet } = await import('@/app/api/advocates/route');
    const freshDb = (await import('@/db')).default;
    
    const mockFrom = jest.fn().mockRejectedValueOnce(new Error('Database error'));
    (freshDb.select as jest.Mock).mockReturnValue({ from: mockFrom });
    
    const request = new NextRequest('http://localhost:3000/api/advocates');
    const response = await freshGet(request);
    
    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.status).toBe('error');
    expect(data.error).toBe('Failed to fetch advocates');
    expect(console.error).toHaveBeenCalledWith(
      'Error fetching advocates:',
      expect.any(Error)
    );
  });

});