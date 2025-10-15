'use client';

import { useEffect, useState } from 'react';
import { ADRQuote } from '@/types/adr';
import { getADRQuotes } from '@/lib/adrs';
import { ADR_NAMES, ADR_REFRESH_INTERVAL, LOGO_DEV_TOKEN } from '@/config/adrs';

export default function ADRTicker() {
  const [quotes, setQuotes] = useState<ADRQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuotes = async () => {
    try {
      const data = await getADRQuotes();
      setQuotes(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching ADR quotes:', err);
      setError('No se pudieron cargar las cotizaciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch inicial
    fetchQuotes();

    // Configurar auto-refresh
    const intervalId = setInterval(fetchQuotes, ADR_REFRESH_INTERVAL);

    // Cleanup
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-y border-gray-200 dark:border-gray-700 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2">
            <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Cargando cotizaciones ADRs...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (error || quotes.length === 0) {
    return null; // No mostrar nada si hay error o no hay datos
  }

  return (
    <section className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-y border-gray-200 dark:border-gray-700 py-4 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-3">
          <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
            </svg>
            ADRs Argentinas
          </h3>
        </div>

        {/* Ticker horizontal */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
          {quotes.map((quote) => {
            const isPositive = quote.pct_change >= 0;
            const companyName = ADR_NAMES[quote.symbol as keyof typeof ADR_NAMES] || quote.symbol;
            const logoUrl = `https://img.logo.dev/ticker/${quote.symbol}?token=${LOGO_DEV_TOKEN}&retina=true`;

            return (
              <div
                key={quote.symbol}
                className="flex-shrink-0 bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200 min-w-[160px]"
              >
                {/* Header con logo y símbolo */}
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={logoUrl}
                    alt={quote.symbol}
                    className="w-6 h-6 rounded-full"
                    onError={(e) => {
                      // Fallback si falla el logo
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-gray-900 dark:text-white">
                      {quote.symbol}
                    </div>
                    <div className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                      {companyName}
                    </div>
                  </div>
                </div>

                {/* Precio */}
                <div className="mb-1">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    ${quote.c.toFixed(2)}
                  </div>
                </div>

                {/* Cambio porcentual */}
                <div className={`flex items-center gap-1 text-xs font-semibold ${
                  isPositive
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {isPositive ? (
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span>{isPositive ? '+' : ''}{quote.pct_change.toFixed(2)}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          height: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: transparent;
          border-radius: 3px;
          transition: background 0.2s;
        }
        .scrollbar-thin:hover::-webkit-scrollbar-thumb {
          background: #cbd5e0;
        }
        .dark .scrollbar-thin:hover::-webkit-scrollbar-thumb {
          background: #4b5563;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #a0aec0 !important;
        }
        .dark .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #6b7280 !important;
        }
      `}</style>
    </section>
  );
}
