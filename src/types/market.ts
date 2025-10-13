export interface Market {
  id: string;
  question: string;
  slug: string;
  endDate: string;
  startDate: string;
  image?: string;
  icon?: string;
  description: string;
  outcomes?: string; // JSON string array
  outcomePrices?: string; // JSON string array
  volume: string;
  active: boolean;
  closed: boolean;
  groupItemTitle?: string;
  groupItemThreshold?: string;
  orderPriceMinTickSize?: number;
  endDateIso: string;
  clobTokenIds?: string; // JSON string array
}

export interface Event {
  id: string;
  ticker: string;
  slug: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  image: string;
  icon: string;
  active: boolean;
  closed: boolean;
  volume: number;
  markets: Market[];
}

export interface EventsResponse {
  events: Event[];
}

export interface MarketsResponse {
  markets: Market[];
}

export interface PricePoint {
  t: number; // Unix timestamp
  p: number; // Price
}

export interface PriceHistoryResponse {
  history: PricePoint[];
}
