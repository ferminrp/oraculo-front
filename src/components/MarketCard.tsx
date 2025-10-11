import { Market } from '@/types/market';

interface MarketCardProps {
  market: Market;
}

export default function MarketCard({ market }: MarketCardProps) {
  const outcomes = market.outcomes ? JSON.parse(market.outcomes) as string[] : [];
  const prices = market.outcomePrices ? JSON.parse(market.outcomePrices) as string[] : [];

  const formatVolume = (volume: string) => {
    const num = parseFloat(volume);
    if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-start gap-4">
        {market.icon && (
          <div className="w-16 h-16 flex-shrink-0">
            <img
              src={market.icon}
              alt={market.question}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
            {market.question}
          </h3>

          {market.groupItemTitle && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {market.groupItemTitle}
            </p>
          )}

          <div className="flex flex-wrap gap-2 mb-3">
            {outcomes.map((outcome, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full"
              >
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {outcome}
                </span>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                  {(parseFloat(prices[index]) * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-4">
              <span className="font-medium">
                Vol: {formatVolume(market.volume)}
              </span>
              <span>
                Cierra: {formatDate(market.endDate)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {market.active && !market.closed && (
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded text-xs font-medium">
                  Activo
                </span>
              )}
              {market.closed && (
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs font-medium">
                  Cerrado
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
