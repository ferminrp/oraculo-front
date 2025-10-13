import { EventsResponse, MarketsResponse, PriceHistoryResponse } from '@/types/market';

// API base URL
export const API_BASE_URL = 'https://api.oraculo.ar/api/curated';
export const PRICE_API_BASE_URL = 'https://clob.polymarket.com';

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

export interface PriceHistoryParams {
  market: string; // CLOB token ID
  interval?: '1m' | '1w' | '1d' | '6h' | '1h' | 'max';
  startTs?: number;
  endTs?: number;
  fidelity?: number;
}

export async function getPriceHistory(params: PriceHistoryParams): Promise<PriceHistoryResponse> {
  const searchParams = new URLSearchParams();
  searchParams.append('market', params.market);

  if (params.interval) searchParams.append('interval', params.interval);
  if (params.startTs) searchParams.append('startTs', params.startTs.toString());
  if (params.endTs) searchParams.append('endTs', params.endTs.toString());

  // Set default fidelity based on interval if not provided
  const fidelity = params.fidelity || (params.interval === '1w' ? 5 : undefined);
  if (fidelity) searchParams.append('fidelity', fidelity.toString());

  const response = await fetch(`${PRICE_API_BASE_URL}/prices-history?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error('Failed to fetch price history');
  }

  return response.json();
}
