// jest.setup.js
import '@testing-library/jest-dom';
import React from 'react';

class MockResponse {
  constructor(body, init = {}) {
    this.body = body;
    this.init = init;
    this.status = init.status || 200;
  }

  static json(data, init = {}) {
    const response = new MockResponse(JSON.stringify(data), init);
    response.status = init.status || 200;
    return response;
  }

  json() {
    return Promise.resolve(JSON.parse(this.body));
  }
}

global.Response = MockResponse;

// mock request, lucide-react and next/server
global.Request = class Request {
  constructor(url) {
    this.url = url;
  }
};

jest.mock('lucide-react', () => ({
  SearchIcon: () => <div data-testid="search-icon" />,
  XIcon: () => <div data-testid="x-icon" />,
  ChevronDownIcon: () => <div data-testid="chevron-down-icon" />,
  ChevronUpIcon: () => <div data-testid="chevron-up-icon" />,
  ArrowUpDownIcon: () => <div data-testid="arrow-updown-icon" />,
  CheckIcon: () => <div data-testid="check-icon" />,
  PhoneIcon: () => <div data-testid="phone-icon" />,
  MapPinIcon: () => <div data-testid="map-pin-icon" />,
  AwardIcon: () => <div data-testid="award-icon" />,
  BadgeIcon: () => <div data-testid="badge-icon" />
}));

jest.mock('next/server', () => ({
  NextRequest: class NextRequest {
    constructor(url) {
      this.url = url;
      this.nextUrl = new URL(url);
    }
  }
}));