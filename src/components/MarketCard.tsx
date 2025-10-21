import { useEffect, useState } from 'react';
import { Market, PricePoint } from '@/types/market';
import { getPriceHistory } from '@/lib/api';
import MarketChartModal from './MarketChartModal';

interface MarketCardProps {
  market: Market;
  eventSlug?: string; // Optional: if provided, link to the event with tid parameter
  totalMarketsInEvent?: number; // Optional: if provided, show total markets count for events
  onChartClick?: (e: React.MouseEvent) => void; // Optional: custom handler for chart click (for events)
}

interface PriceHistoryData {
  data: PricePoint[];
  label: string;
}

// Helper function to parse outcomes/prices that can be either JSON array or comma-separated string
function parseArrayField(field: string | undefined): string[] {
  if (!field || typeof field !== 'string') return [];

  try {
    // Try parsing as JSON first (old format: '["Sí","No"]')
    return JSON.parse(field) as string[];
  } catch {
    // If JSON parse fails, split by comma (new format: 'Sí,No')
    return field.split(',').map(s => s.trim());
  }
}

export default function MarketCard({ market, eventSlug, totalMarketsInEvent, onChartClick }: MarketCardProps) {
  const outcomes = parseArrayField(market.outcomes);
  const prices = parseArrayField(market.outcomePrices);
  const [priceHistories, setPriceHistories] = useState<PriceHistoryData[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch price histories when modal opens
  useEffect(() => {
    async function fetchAllPriceHistories() {
      // Only fetch if modal is open and we're using the default modal (not custom handler)
      if (!isModalOpen || !market.clobTokenIds || onChartClick) return;

      try {
        setLoadingHistory(true);
        const clobTokenIds = parseArrayField(market.clobTokenIds);
        if (clobTokenIds.length === 0) return;

        // Fetch price history for all outcomes in parallel
        const historyPromises = clobTokenIds.map(async (clobId, index) => {
          try {
            const response = await getPriceHistory({
              market: clobId,
              interval: '1w'
            });
            return {
              data: response.history,
              label: outcomes[index] || `Outcome ${index + 1}`
            };
          } catch (error) {
            console.error(`Error fetching price history for ${outcomes[index]}:`, error);
            return null;
          }
        });

        const results = await Promise.all(historyPromises);
        const validResults = results.filter((r): r is PriceHistoryData => r !== null);
        setPriceHistories(validResults);
      } catch (error) {
        console.error('Error fetching price histories:', error);
      } finally {
        setLoadingHistory(false);
      }
    }

    fetchAllPriceHistories();
  }, [isModalOpen, market.clobTokenIds]);

  const formatVolume = (volume: string) => {
    const num = parseFloat(volume);
    if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  // Find the highest probability outcome
  const maxPriceIndex = prices.reduce((maxIdx, price, idx, arr) =>
    parseFloat(price) > parseFloat(arr[maxIdx]) ? idx : maxIdx, 0
  );
  const maxOutcome = outcomes[maxPriceIndex];
  const maxProbability = (parseFloat(prices[maxPriceIndex]) * 100).toFixed(0);

  // Determine if the outcome is "No" for styling
  const isNoOutcome = maxOutcome?.toLowerCase() === 'no';

  const polymarketUrl = eventSlug
    ? `https://polymarket.com/event/${eventSlug}?tid=${market.id}&via=oraculo.ar`
    : `https://polymarket.com/event/${market.slug}?via=oraculo.ar`;

  const handleChartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // If custom handler provided (for events), use it
    if (onChartClick) {
      onChartClick(e);
    } else {
      // Otherwise, open the default market modal
      setIsModalOpen(true);
    }
  };

  return (
    <>
      {/* Main clickable area */}
      <a
        href={polymarketUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`group transition-all duration-300 flex items-center gap-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl p-5 border-2 hover:-translate-y-1 ${
          isNoOutcome
            ? 'border-gray-200 dark:border-gray-700 hover:border-red-400 dark:hover:border-red-600'
            : 'border-gray-200 dark:border-gray-700 hover:border-emerald-400 dark:hover:border-emerald-600'
        }`}
      >
          {/* Icon */}
          {market.icon && (
            <div className={`w-16 h-16 flex-shrink-0 rounded-full overflow-hidden ring-2 ring-gray-200 dark:ring-gray-700 transition-all duration-300 ${
              isNoOutcome
                ? 'group-hover:ring-red-400 dark:group-hover:ring-red-600'
                : 'group-hover:ring-emerald-400 dark:group-hover:ring-emerald-600'
            }`}>
              <img
                src={market.icon}
                alt={market.question}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
              />
            </div>
          )}

          {/* Title and Volume */}
          <div className="flex-1 min-w-0">
            <h3 className={`text-base mb-1 font-bold text-gray-900 dark:text-gray-100 line-clamp-2 transition-colors duration-300 ${
              isNoOutcome
                ? 'group-hover:text-red-600 dark:group-hover:text-red-400'
                : 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400'
            }`}>
              {market.question}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              {formatVolume(market.volume)}
              {totalMarketsInEvent && totalMarketsInEvent > 1 && (
                <span className="ml-2">• {totalMarketsInEvent} mercados</span>
              )}
            </p>
          </div>

          {/* Chart Icon Button */}
          {market.clobTokenIds && (
            <button
              onClick={handleChartClick}
              className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 transition-all duration-300"
              aria-label="Ver gráfico"
            >
              <svg
                className="w-6 h-6 text-blue-500 dark:text-blue-400 hover:scale-110 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </button>
          )}

        {/* Highest Probability Badge */}
        <div className={`flex-shrink-0 text-white rounded-lg font-bold group-hover:scale-105 transition-transform duration-300 px-4 py-2 text-lg ${
          isNoOutcome
            ? 'bg-red-500 dark:bg-red-600'
            : 'bg-emerald-500 dark:bg-emerald-600'
        }`}>
          {maxProbability}% {maxOutcome}
        </div>
      </a>

      {/* Chart Modal */}
      <MarketChartModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        marketTitle={market.question}
        priceHistories={priceHistories}
        loading={loadingHistory}
      />
    </>
  );
}
