'use client';

import { useEffect, useState } from 'react';
import { BondQuote } from '@/types/bond';
import { getBondQuotes } from '@/lib/bonds';
import { BOND_NAMES, BOND_REFRESH_INTERVAL, BOND_ICON_URL } from '@/config/bonds';

export default function BondTicker() {
  const [quotes, setQuotes] = useState<BondQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuotes = async () => {
    try {
      const data = await getBondQuotes();
      setQuotes(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching bond quotes:', err);
      setError('No se pudieron cargar las cotizaciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch inicial
    fetchQuotes();

    // Configurar auto-refresh
    const intervalId = setInterval(fetchQuotes, BOND_REFRESH_INTERVAL);

    // Cleanup
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <section className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 border-y border-gray-200 dark:border-gray-700 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2">
            <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-600"></div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Cargando cotizaciones de bonos...
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
    <section className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 border-y border-gray-200 dark:border-gray-700 py-4 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-3">
          <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <svg className="w-4 h-4 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            Bonos Argentinos
          </h3>
        </div>

        {/* Ticker horizontal */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
          {quotes.map((quote) => {
            const isPositive = quote.pct_change >= 0;
            const bondName = BOND_NAMES[quote.symbol as keyof typeof BOND_NAMES] || quote.symbol;

            return (
              <div
                key={quote.symbol}
                className="flex-shrink-0 bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200 min-w-[160px]"
              >
                {/* Header con icono y símbolo */}
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={BOND_ICON_URL}
                    alt="Bandera Argentina"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-gray-900 dark:text-white">
                      {quote.symbol}
                    </div>
                    <div className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                      {bondName}
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
