import { ADRQuote } from '@/types/adr';
import { WHITELISTED_ADRS } from '@/config/adrs';

// API endpoint para ADRs
const ADR_API_URL = 'https://data912.com/live/usa_adrs';

/**
 * Obtiene las cotizaciones de ADRs argentinas desde data912.com
 * y filtra solo los símbolos whitelisteados
 */
export async function getADRQuotes(): Promise<ADRQuote[]> {
  try {
    const response = await fetch(ADR_API_URL);

    if (!response.ok) {
      throw new Error('Failed to fetch ADR quotes');
    }

    const allQuotes: ADRQuote[] = await response.json();

    // Filtrar solo los símbolos que están en nuestra whitelist
    const filteredQuotes = allQuotes.filter(quote =>
      WHITELISTED_ADRS.includes(quote.symbol as any)
    );

    // Ordenar por variación porcentual (de mayor a menor)
    return filteredQuotes.sort((a, b) => b.pct_change - a.pct_change);
  } catch (error) {
    console.error('Error fetching ADR quotes:', error);
    throw error;
  }
}
