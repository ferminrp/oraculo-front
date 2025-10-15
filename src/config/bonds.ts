// Configuración de bonos argentinos a mostrar
export const WHITELISTED_BONDS = [
  'AL30D',
  'AL29D',
  'GD30D',
  'AL35D',
  'GD35D',
  'AE38D',
  'GD41D',
  'AL41D'
] as const;

export type BondSymbol = typeof WHITELISTED_BONDS[number];

// Nombres completos de los bonos
export const BOND_NAMES: Record<BondSymbol, string> = {
  AL30D: 'Bono Argentina 2030',
  AL29D: 'Bono Argentina 2029',
  GD30D: 'Global 2030',
  AL35D: 'Bono Argentina 2035',
  GD35D: 'Global 2035',
  AE38D: 'Bono Argentina 2038',
  GD41D: 'Global 2041',
  AL41D: 'Bono Argentina 2041'
};

// Icono de la bandera argentina para todos los bonos
export const BOND_ICON_URL = 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Flag_of_Argentina.svg';

// Intervalo de actualización (en milisegundos)
export const BOND_REFRESH_INTERVAL = 30000; // 30 segundos
