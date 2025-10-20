import { useState } from 'react';
import { Event } from '@/types/market';
import MarketCard from './MarketCard';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) return `$${(volume / 1000000).toFixed(2)}M`;
    if (volume >= 1000) return `$${(volume / 1000).toFixed(2)}K`;
    return `$${volume.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Helper function to parse outcomes/prices that can be either JSON array or comma-separated string
  const parseArrayField = (field: string | undefined): string[] => {
    if (!field || typeof field !== 'string') return [];

    try {
      // Try parsing as JSON first (old format: '["Sí","No"]')
      return JSON.parse(field) as string[];
    } catch {
      // If JSON parse fails, split by comma (new format: 'Sí,No')
      return field.split(',').map(s => s.trim());
    }
  };

  // Get the market with highest YES percentage, fallback to highest volume
  const getMarketWithHighestYes = () => {
    if (event.markets.length === 0) return null;

    // Find markets with "Sí" or "Yes" outcome
    const marketsWithYes = event.markets.map(market => {
      const outcomes = parseArrayField(market.outcomes);
      const prices = parseArrayField(market.outcomePrices);

      // Find index of "Sí" or "Yes" (case insensitive)
      const yesIndex = outcomes.findIndex(o =>
        o.toLowerCase() === 'sí' || o.toLowerCase() === 'yes'
      );

      if (yesIndex === -1) return null;

      return {
        market,
        yesPercentage: parseFloat(prices[yesIndex]) * 100,
        volume: parseFloat(market.volume)
      };
    }).filter((item): item is NonNullable<typeof item> => item !== null);

    // If we have markets with "Yes", return the one with highest %
    // In case of tie, use volume as tiebreaker
    if (marketsWithYes.length > 0) {
      return marketsWithYes.reduce((max, current) => {
        if (current.yesPercentage > max.yesPercentage) return current;
        if (current.yesPercentage === max.yesPercentage && current.volume > max.volume) return current;
        return max;
      }).market;
    }

    // Fallback: return market with highest volume
    return event.markets.reduce((max, current) =>
      parseFloat(current.volume) > parseFloat(max.volume) ? current : max
    );
  };

  const primaryMarket = getMarketWithHighestYes();
  const hasMultipleMarkets = event.markets.length > 1;

  if (!primaryMarket) return null;

  // Collapsed state: Show only the primary market as a standalone card
  if (!isExpanded) {
    return (
      <div
        className="relative h-full cursor-pointer"
        onClick={() => hasMultipleMarkets && setIsExpanded(true)}
      >
        {/* Primary market card with total markets count */}
        <MarketCard
          market={primaryMarket}
          eventSlug={event.slug}
          totalMarketsInEvent={event.markets.length}
        />
      </div>
    );
  }

  // Expanded state: Show event header, description, and all markets
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-purple-200 dark:border-purple-700 overflow-hidden h-full flex flex-col">
      {/* Event Header */}
      <div className="relative h-32 bg-gradient-to-r from-purple-600 to-indigo-600">
        {event.image && (
          <img
            src={event.image}
            alt={event.title}
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <div className="flex items-start gap-3">
            {event.icon && (
              <div className="w-14 h-14 flex-shrink-0 bg-white rounded-lg p-1.5">
                <img
                  src={event.icon}
                  alt={event.title}
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            <div className="flex-1">
              <div className="flex items-start justify-between gap-3 mb-1.5">
                <h2 className="text-xl font-bold drop-shadow-lg flex-1">
                  {event.title}
                </h2>
                <a
                  href={`https://polymarket.com/event/${event.slug}?via=oraculo.ar`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white text-xs font-bold rounded-full border-2 border-white/30 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Ver en Polymarket
                </a>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="font-semibold">
                  Volumen total: {formatVolume(event.volume)}
                </span>
                <span>
                  {event.markets.length} mercado{event.markets.length !== 1 ? 's' : ''}
                </span>
                {event.active && !event.closed && (
                  <span className="px-2 py-1 bg-green-500 rounded-full text-xs font-medium">
                    Activo
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Description */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <p className="text-gray-700 dark:text-gray-300 text-sm leading-normal whitespace-pre-line">
          {isDescriptionExpanded
            ? event.description
            : event.description.split('\n').slice(0, 3).join('\n')}
        </p>
        {event.description.split('\n').length > 3 && (
          <button
            onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
            className="text-purple-600 dark:text-purple-400 hover:underline text-xs mt-1.5 font-medium"
          >
            {isDescriptionExpanded ? 'Ver menos' : 'Ver más...'}
          </button>
        )}
        <div className="mt-3 text-xs text-gray-600 dark:text-gray-400">
          <span>Cierra: {formatDate(event.endDate)}</span>
        </div>
      </div>

      {/* All Markets */}
      <div className="p-4 flex-1">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">
          Todos los Mercados
        </h3>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {event.markets
            .sort((a, b) => parseFloat(b.volume) - parseFloat(a.volume))
            .map((market) => (
              <MarketCard key={market.id} market={market} eventSlug={event.slug} />
            ))}
        </div>
      </div>

      {/* Collapse button */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setIsExpanded(false)}
          className="w-full flex items-center justify-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium text-sm transition-colors"
        >
          Ver menos
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
