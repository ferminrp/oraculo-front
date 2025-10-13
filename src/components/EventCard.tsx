import { useState } from 'react';
import { Event } from '@/types/market';
import MarketCard from './MarketCard';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
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

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl shadow-xl overflow-hidden mb-6 border border-gray-200 dark:border-gray-700">
      {/* Header del evento */}
      <div className="relative h-32 bg-gradient-to-r from-blue-600 to-purple-600">
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

      {/* Descripción del evento */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <p className="text-gray-700 dark:text-gray-300 text-sm leading-normal whitespace-pre-line">
          {isDescriptionExpanded
            ? event.description
            : event.description.split('\n').slice(0, 3).join('\n')}
        </p>
        {event.description.split('\n').length > 3 && (
          <button
            onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
            className="text-blue-600 dark:text-blue-400 hover:underline text-xs mt-1.5 font-medium"
          >
            {isDescriptionExpanded ? 'Ver menos' : 'Ver más...'}
          </button>
        )}
        <div className="mt-3 text-xs text-gray-600 dark:text-gray-400">
          <span>Cierra: {formatDate(event.endDate)}</span>
        </div>
      </div>

      {/* Mercados del evento */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">
          Mercados
        </h3>
        <div className="space-y-3">
          {event.markets.map((market) => (
            <MarketCard key={market.id} market={market} eventSlug={event.slug} />
          ))}
        </div>
      </div>
    </div>
  );
}
