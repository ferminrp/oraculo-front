import { useState } from 'react';
import { Event } from '@/types/market';
import MarketCard from './MarketCard';
import EventChartModal from './EventChartModal';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

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

      // Find index of "Sí" or "Yes" (case insensitive, normalized for accents)
      const yesIndex = outcomes.findIndex(o => {
        const normalized = o.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return normalized === 'si' || normalized === 'yes';
      });

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

  const handleChartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="relative h-full">
        {/* Primary market card with total markets count */}
        <MarketCard
          market={primaryMarket}
          eventSlug={event.slug}
          totalMarketsInEvent={event.markets.length}
          onChartClick={hasMultipleMarkets ? handleChartClick : undefined}
        />
      </div>

      {/* Event Chart Modal */}
      <EventChartModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        event={event}
      />
    </>
  );
}
