// Jxt Tap brand color tokens
// Single source of truth for colors across the app

export const colors = {
  // Brand
  teal: '#026B6B',
  orange: '#FD6B0A',

  // Teal shades (for backgrounds, splash screen, active states)
  tealDark: '#014E4E',
  tealLight: '#3E8F8F',

  // Orange shades (for CTAs, alerts, highlights)
  orangeDark: '#D65A08',
  orangeLight: '#FF8C3D',

  // Semantic / status colors
  success: '#1FA35C',   // payment success, positive balance
  error: '#D64545',     // payment failed, insufficient balance
  warning: '#F2A93B',   // offline banner, low balance warning

  // Neutrals
  white: '#FFFFFF',
  black: '#000000',
  background: '#F7F9F9',
  surface: '#FFFFFF',
  border: '#E1E6E6',

  // Text
  textPrimary: '#1A1F1F',
  textSecondary: '#5C6666',
  textOnTeal: '#FFFFFF',
  textOnOrange: '#FFFFFF',
} as const;

export type ColorKey = keyof typeof colors;