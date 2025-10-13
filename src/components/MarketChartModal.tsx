'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { PricePoint } from '@/types/market';
import Sparkline from './Sparkline';

interface MarketChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  marketTitle: string;
  priceHistories: Array<{
    data: PricePoint[];
    label: string;
  }>;
  loading: boolean;
}

export default function MarketChartModal({
  isOpen,
  onClose,
  marketTitle,
  priceHistories,
  loading
}: MarketChartModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-h-[90vh] overflow-auto animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-start justify-between z-10">
          <div className="flex-1 pr-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              {marketTitle}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Historial de precios - Última semana
            </p>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Cerrar modal"
          >
            <svg
              className="w-6 h-6 text-gray-500 dark:text-gray-400"
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

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400 font-medium">
                Cargando datos del mercado...
              </p>
            </div>
          ) : priceHistories.length > 0 ? (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 rounded-xl p-6">
              <Sparkline
                datasets={priceHistories}
                width={800}
                height={300}
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
                No hay datos de historial disponibles para este mercado
              </p>
            </div>
          )}
        </div>

        {/* Footer with info */}
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
