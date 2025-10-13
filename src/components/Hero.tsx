'use client';

interface HeroProps {
  totalMarkets?: number;
  totalVolume?: string;
}

export default function Hero({ totalMarkets = 0, totalVolume = '$0' }: HeroProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 dark:from-blue-900 dark:via-purple-900 dark:to-indigo-950">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-grid-pattern animate-grid-flow"></div>
      </div>

      {/* Floating orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/30 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/30 rounded-full blur-3xl animate-float-delayed"></div>
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-pink-400/20 rounded-full blur-3xl animate-float-slow"></div>

      {/* Content */}
      <div className="relative container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 mb-8 animate-fade-in-down">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse-glow"></div>
            <span className="text-white text-sm font-semibold">Mercados en vivo</span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight animate-fade-in-up">
            <span className="inline-block animate-text-shimmer bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent bg-[length:200%_100%]">
              Oráculo.ar
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in-up-delay">
            Mercados predictivos de Argentina. Apuesta en eventos políticos, deportivos y culturales en tiempo real.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up-delay-2">
            <a
              href="#mercados"
              className="group px-8 py-4 bg-white text-blue-600 rounded-full font-bold text-lg shadow-2xl hover:shadow-white/50 hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              Explorar Mercados
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <a
              href="https://polymarket.com?via=oraculo.ar"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-full font-bold text-lg border-2 border-white/30 hover:bg-white/20 hover:scale-105 transition-all duration-300"
            >
              Ir a Polymarket
            </a>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto animate-fade-in-up-delay-3">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
              <div className="text-4xl font-black text-white mb-2">{totalMarkets}</div>
              <div className="text-blue-100 text-sm font-medium">Mercados Activos</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
              <div className="text-4xl font-black text-white mb-2">{totalVolume}</div>
              <div className="text-blue-100 text-sm font-medium">Volumen Total</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
              <div className="text-4xl font-black text-white mb-2">24/7</div>
              <div className="text-blue-100 text-sm font-medium">En Vivo</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
              <div className="text-4xl font-black text-white mb-2">🇦🇷</div>
              <div className="text-blue-100 text-sm font-medium">Argentina</div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave separator */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-24" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path
            d="M0,0 C300,80 600,80 900,40 C1050,20 1150,10 1200,20 L1200,120 L0,120 Z"
            fill="currentColor"
            className="text-gray-50 dark:text-gray-900"
          />
        </svg>
      </div>
    </div>
  );
}
