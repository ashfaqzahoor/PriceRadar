/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#FAFAFA',
        surface: '#FFFFFF',
        border: '#E5E7EB',
        borderSubtle: '#F0F2F5',
        textMain: '#1C1C1E',
        textMuted: '#6B7280',
        textDim: '#9CA3AF',
        accent: '#2E7D32', // Trust green Skyscanner-like lowest price
        accentLight: '#E8F5E9',
        accentBlue: '#2563EB',
        deltaGreen: '#16A34A',
        deltaRed: '#DC2626'
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace']
      }
    }
  },
  plugins: []
};
