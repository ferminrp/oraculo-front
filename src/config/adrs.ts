// Configuración de ADRs argentinas a mostrar
export const WHITELISTED_ADRS = [
  'CEPU',
  'SUPV',
  'BMA',
  'PAM',
  'EDN',
  'GGAL',
  'BBAR',
  'VIST',
  'YPF',
  'IRS'
] as const;

export type ADRSymbol = typeof WHITELISTED_ADRS[number];

// Nombres completos de las empresas
export const ADR_NAMES: Record<ADRSymbol, string> = {
  CEPU: 'Central Puerto',
  SUPV: 'Grupo Supervielle',
  BMA: 'Banco Macro',
  PAM: 'Pampa Energía',
  EDN: 'Edenor',
  GGAL: 'Grupo Financiero Galicia',
  BBAR: 'BBVA Argentina',
  VIST: 'Vista Energy',
  YPF: 'YPF',
  IRS: 'IRSA'
};

// Token para logo.dev
export const LOGO_DEV_TOKEN = 'pk_aOjcq-uNRdm3AWE9VR3rIA';

// Intervalo de actualización (en milisegundos)
export const ADR_REFRESH_INTERVAL = 30000; // 30 segundos
