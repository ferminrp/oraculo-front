export interface BondQuote {
  symbol: string;
  q_bid: number;         // Cantidad bid
  px_bid: number;        // Precio bid
  px_ask: number;        // Precio ask
  q_ask: number;         // Cantidad ask
  v: number;             // Volumen
  q_op: number;          // Cantidad operaciones
  c: number;             // Precio de cierre/actual
  pct_change: number;    // Cambio porcentual
}

export interface BondQuotesResponse {
  quotes: BondQuote[];
}
