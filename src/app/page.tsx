'use client';

import { useEffect, useState } from 'react';
import EventCard from '@/components/EventCard';
import MarketCard from '@/components/MarketCard';
import Hero from '@/components/Hero';
import { Event, Market } from '@/types/market';

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate total volume
  const totalVolume = markets.reduce((sum, market) => sum + parseFloat(market.volume), 0);
  const formatVolume = (volume: number) => {
    if (volume >= 1000000) return `$${(volume / 1000000).toFixed(1)}M`;
    if (volume >= 1000) return `$${(volume / 1000).toFixed(0)}K`;
    return `$${volume.toFixed(0)}`;
  };

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch events and standalone markets in parallel
        const [eventsResponse, marketsResponse] = await Promise.all([
          fetch('https://api.oraculo.ar/api/curated/events'),
          fetch('https://api.oraculo.ar/api/curated/markets')
        ]);

        if (!eventsResponse.ok || !marketsResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const [eventsData, marketsData] = await Promise.all([
          eventsResponse.json(),
          marketsResponse.json()
        ]);

        setEvents(eventsData.events);
        setMarkets(marketsData.markets);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <Hero
        totalMarkets={markets.length + events.reduce((sum, event) => sum + event.markets.length, 0)}
        totalVolume={formatVolume(totalVolume)}
      />

      {/* Main content */}
      <main id="mercados" className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 dark:text-gray-400 text-lg mt-4">
              Cargando datos...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400 text-lg">
              Error: {error}
            </p>
          </div>
        ) : (
          <>
            {/* Standalone Markets Section */}
            {markets.length > 0 && (
              <section className="mb-12 animate-fadeIn">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-blue-400 rounded-full"></div>
                  <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                    Mercados Destacados
                  </h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent dark:from-gray-700"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {markets.map((market, index) => (
                    <div
                      key={market.id}
                      style={{ animationDelay: `${index * 100}ms` }}
                      className="animate-slideUp"
                    >
                      <MarketCard market={market} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Events Section */}
            {events.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Eventos
                </h2>
                <div className="space-y-8">
                  {events.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </section>
            )}

            {/* Empty state */}
            {events.length === 0 && markets.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  No hay datos disponibles en este momento.
                </p>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-900 dark:to-black border-t-4 border-blue-500 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-white mb-2">Oráculo.ar</h3>
              <p className="text-gray-400 text-sm">
                Mercados predictivos de Argentina en tiempo real
              </p>
            </div>
            <div className="flex items-center gap-6">
              <a
                href="https://api.oraculo.ar"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                API
              </a>
              <a
                href="https://polymarket.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                Polymarket
              </a>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-700 text-center">
            <p className="text-gray-500 text-xs">
              © 2025 Oráculo.ar - Datos proporcionados por Polymarket
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
