'use client';

import { useEffect, useState } from 'react';
import EventCard from '@/components/EventCard';
import MarketCard from '@/components/MarketCard';
import { Event, Market } from '@/types/market';

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Oráculo.ar - Mercados Predictivos de Argentina
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Eventos y mercados de predicción sobre Argentina
          </p>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
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
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Mercados Destacados
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {markets.map((market) => (
                    <MarketCard key={market.id} market={market} />
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
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600 dark:text-gray-400">
          <p>
            Datos proporcionados por{' '}
            <a
              href="https://api.oraculo.ar"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Oráculo.ar API
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
