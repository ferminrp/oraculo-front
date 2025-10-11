'use client';

import { useEffect, useState } from 'react';
import EventCard from '@/components/EventCard';
import { Event } from '@/types/market';

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch('https://api.oraculo.ar/api/curated/events');
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        setEvents(data.events);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
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
              Cargando eventos...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400 text-lg">
              Error: {error}
            </p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No hay eventos disponibles en este momento.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
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
