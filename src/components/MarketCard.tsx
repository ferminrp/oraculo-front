import { useEffect, useState } from 'react';
import { Market, PricePoint } from '@/types/market';
import { getPriceHistory } from '@/lib/api';
import Sparkline from './Sparkline';

interface MarketCardProps {
  market: Market;
  eventSlug?: string; // Optional: if provided, link to the event with tid parameter
}

interface PriceHistoryData {
  data: PricePoint[];
  label: string;
}

export default function MarketCard({ market, eventSlug }: MarketCardProps) {
  const outcomes = market.outcomes ? JSON.parse(market.outcomes) as string[] : [];
  const prices = market.outcomePrices ? JSON.parse(market.outcomePrices) as string[] : [];
  const [priceHistories, setPriceHistories] = useState<PriceHistoryData[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    async function fetchAllPriceHistories() {
      // Only fetch if user wants to see the chart
      if (!showChart || !market.clobTokenIds) return;

      try {
        setLoadingHistory(true);
        const clobTokenIds = JSON.parse(market.clobTokenIds) as string[];
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
  }, [showChart, market.clobTokenIds]);

  const formatVolume = (volume: string) => {
    const num = parseFloat(volume);
    if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600 hover:-translate-y-1">
      <div className="flex items-start gap-3">
        {market.icon && (
          <div className="w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden ring-2 ring-gray-200 dark:ring-gray-700 group-hover:ring-blue-400 dark:group-hover:ring-blue-600 transition-all duration-300">
            <img
              src={market.icon}
              alt={market.question}
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
            {market.question}
          </h3>

          {market.groupItemTitle && (
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
              {market.groupItemTitle}
            </p>
          )}

          {/* Outcomes with current prices - compact version */}
          <div className="flex flex-wrap gap-2 mb-2">
            {outcomes.map((outcome, index) => (
              <div
                key={index}
                className="flex items-center gap-1.5 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 px-2.5 py-1 rounded-full border border-gray-200 dark:border-gray-600 text-xs"
              >
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {outcome}
                </span>
                <span className="font-extrabold text-blue-600 dark:text-blue-400">
                  {(parseFloat(prices[index]) * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>

          {/* Compact info row */}
          <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-3">
            <span className="font-medium">Vol: {formatVolume(market.volume)}</span>
            <span>{formatDate(market.endDate)}</span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 mb-2">
            {/* Chart toggle button */}
            {market.clobTokenIds && (
              <button
                onClick={() => setShowChart(!showChart)}
                className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                <svg
                  className={`w-4 h-4 transition-transform duration-300 ${showChart ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                {showChart ? 'Ocultar' : 'Ver gráfico'}
              </button>
            )}

            {/* Polymarket link button */}
            <a
              href={
                eventSlug
                  ? `https://polymarket.com/event/${eventSlug}?tid=${market.id}&via=oraculo.ar`
                  : `https://polymarket.com/event/${market.slug}?via=oraculo.ar`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-xs font-bold rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Ver en Polymarket
            </a>
          </div>

          {/* Price Chart - collapsible */}
          {showChart && (
            <div className="mt-3 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 rounded-xl border-2 border-blue-200 dark:border-blue-800 shadow-inner animate-slideDown">
              {loadingHistory ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : priceHistories.length > 0 ? (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide flex items-center gap-2">
                      <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                      </svg>
                      Tendencia (7 días)
                    </h4>
                  </div>
                  <Sparkline
                    datasets={priceHistories}
                    width={300}
                    height={100}
                    showLabels={true}
                  />
                </>
              ) : (
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-4">
                  No hay datos de historial disponibles
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
