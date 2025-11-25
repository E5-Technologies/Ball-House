// App Theme - Dark Mode with Vibrant Blue/Purple Accents
export const Colors = {
  // Background Colors
  background: '#000000',        // Deep black background
  cardBackground: '#FFFFFF',    // White cards
  inputBackground: '#1A1A1A',   // Dark input fields
  
  // Primary Colors
  primary: '#6B4FFF',           // Vibrant blue/purple
  primaryDark: '#3A4EFF',       // Rich blue for pins
  primaryLight: '#7850FF',      // Lighter purple
  
  // Text Colors
  text: '#FFFFFF',              // White text on dark
  textSecondary: '#AAAAAA',     // Gray text
  textDark: '#000000',          // Black text on light cards
  textMuted: '#666666',         // Muted gray
  
  // Accent Colors
  accent: '#FF6B35',            // Orange accent (kept from original)
  success: '#4CAF50',           // Green
  warning: '#FFC107',           // Yellow
  error: '#F44336',             // Red
  
  // Border & Divider Colors
  border: '#333333',            // Dark gray borders
  divider: '#222222',           // Subtle dividers
  
  // Heatmap Colors (for player counts)
  heatEmpty: '#555555',
  heatLow: '#4CAF50',
  heatMedium: '#FFC107',
  heatHigh: '#FF9800',
  heatVeryHigh: '#F44336',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const Typography = {
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  weights: {
    regular: '400' as '400',
    medium: '500' as '500',
    semibold: '600' as '600',
    bold: '700' as '700',
  },
};
