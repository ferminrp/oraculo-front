import { BondQuote } from '@/types/bond';
import { WHITELISTED_BONDS } from '@/config/bonds';

// API endpoint para bonos argentinos
const BOND_API_URL = 'https://data912.com/live/arg_bonds';

/**
 * Obtiene las cotizaciones de bonos argentinos desde data912.com
 * y filtra solo los símbolos whitelisteados
 */
export async function getBondQuotes(): Promise<BondQuote[]> {
  try {
    const response = await fetch(BOND_API_URL);

    if (!response.ok) {
      throw new Error('Failed to fetch bond quotes');
    }

    const allQuotes: BondQuote[] = await response.json();

    // Filtrar solo los símbolos que están en nuestra whitelist
    const filteredQuotes = allQuotes.filter(quote =>
      (WHITELISTED_BONDS as readonly string[]).includes(quote.symbol)
    );

    // Ordenar por variación porcentual (de mayor a menor)
    return filteredQuotes.sort((a, b) => b.pct_change - a.pct_change);
  } catch (error) {
    console.error('Error fetching bond quotes:', error);
    throw error;
  }
}
