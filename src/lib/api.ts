import { EventsResponse, MarketsResponse } from '@/types/market';

// API base URL
export const API_BASE_URL = 'https://api.oraculo.ar/api/curated';

// Client-side fetch functions - no server caching
export async function getEvents(): Promise<EventsResponse> {
  const response = await fetch(`${API_BASE_URL}/events`);

  if (!response.ok) {
    throw new Error('Failed to fetch events');
  }

  return response.json();
}

export async function getMarkets(): Promise<MarketsResponse> {
  const response = await fetch(`${API_BASE_URL}/markets`);

  if (!response.ok) {
    throw new Error('Failed to fetch markets');
  }

  return response.json();
}
