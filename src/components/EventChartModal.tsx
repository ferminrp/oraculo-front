'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Event, PricePoint } from '@/types/market';
import { getPriceHistory } from '@/lib/api';
import Sparkline from './Sparkline';
import MarketCard from './MarketCard';

interface EventChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
}

interface PriceHistoryData {
  data: PricePoint[];
  label: string;
}

// Helper function to parse outcomes/prices that can be either JSON array or comma-separated string or native array
function parseArrayField(field: string | string[] | undefined): string[] {
  if (!field) return [];

  // If it's already an array, return it directly
  if (Array.isArray(field)) return field;

  // If it's not a string, return empty array
  if (typeof field !== 'string') return [];

  try {
    return JSON.parse(field) as string[];
  } catch {
    return field.split(',').map(s => s.trim());
  }
}

export default function EventChartModal({
  isOpen,
  onClose,
  event
}: EventChartModalProps) {
  const [mounted, setMounted] = useState(false);
  const [yesSeriesData, setYesSeriesData] = useState<PriceHistoryData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Fetch all YES series when modal opens
  useEffect(() => {
    async function fetchAllYesSeries() {
      if (!isOpen) return;

      try {
        setLoading(true);

        // Filter markets that have a YES outcome
        const marketsWithYes = event.markets.filter(market => {
          const outcomes = parseArrayField(market.outcomes);
          return outcomes.some(o => o.toLowerCase() === 'sí' || o.toLowerCase() === 'yes');
        });

        // Fetch price history for each market's YES outcome
        const seriesPromises = marketsWithYes.map(async (market) => {
          try {
            const outcomes = parseArrayField(market.outcomes);
            const clobTokenIds = parseArrayField(market.clobTokenIds);

            // Find YES index
            const yesIndex = outcomes.findIndex(o =>
              o.toLowerCase() === 'sí' || o.toLowerCase() === 'yes'
            );

            if (yesIndex === -1 || !clobTokenIds[yesIndex]) return null;

            const response = await getPriceHistory({
              market: clobTokenIds[yesIndex],
              interval: '1w'
            });

            return {
              data: response.history,
              label: market.question
            };
          } catch (error) {
            console.error(`Error fetching YES series for ${market.question}:`, error);
            return null;
          }
        });

        const results = await Promise.all(seriesPromises);
        const validResults = results.filter((r): r is PriceHistoryData => r !== null);
        setYesSeriesData(validResults);
      } catch (error) {
        console.error('Error fetching YES series:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAllYesSeries();
  }, [isOpen, event.markets]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

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

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-h-[90vh] overflow-auto animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Event Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-600 p-6 z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              <div className="flex items-center gap-3 mb-3">
                {event.icon && (
                  <div className="w-12 h-12 bg-white rounded-lg p-1.5">
                    <img
                      src={event.icon}
                      alt={event.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {event.title}
                  </h2>
                  <div className="flex items-center gap-3 text-sm text-purple-100">
                    <span>Volumen total: {formatVolume(event.volume)}</span>
                    <span>•</span>
                    <span>{event.markets.length} mercados</span>
                    <span>•</span>
                    <span>Cierra: {formatDate(event.endDate)}</span>
                  </div>
                </div>
              </div>
              <p className="text-purple-50 text-sm leading-relaxed">
                {event.description}
              </p>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              aria-label="Cerrar modal"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Unified YES Series Chart */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
            Evolución de Probabilidades (YES)
          </h3>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400 font-medium">
                Cargando datos del evento...
              </p>
            </div>
          ) : yesSeriesData.length > 0 ? (
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 rounded-xl p-6">
              <Sparkline
                datasets={yesSeriesData}
                width={1000}
                height={400}
                showLabels={true}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <svg
                className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <p className="text-gray-500 dark:text-gray-400 text-center">
                No hay mercados con outcome &quot;YES&quot; en este evento
              </p>
            </div>
          )}
        </div>

        {/* All Markets List */}
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
            Todos los Mercados
          </h3>
          <div className="space-y-4">
            {event.markets
              .sort((a, b) => parseFloat(b.volume) - parseFloat(a.volume))
              .map((market) => (
                <MarketCard key={market.id} market={market} eventSlug={event.slug} />
              ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Los datos se actualizan cada 15 minutos • Presiona ESC o haz click fuera para cerrar
          </p>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
