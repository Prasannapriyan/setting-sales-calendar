export default {
  plugins: {
    'tailwindcss': {},
    'autoprefixer': {},
    ...(process.env.NODE_ENV === 'production' ? {
      'cssnano': {
        preset: ['default', {
          discardComments: {
            removeAll: true,
          },
          normalizeWhitespace: false,
          // Disable minification of calc expressions for better readability
          calc: false,
        }],
      },
      '@fullhuman/postcss-purgecss': {
        content: [
          './src/**/*.{js,jsx,ts,tsx}',
          './index.html'
        ],
        defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
        safelist: {
          standard: [/^[a-z]*-/],
          deep: [/hover$/, /focus$/, /active$/, /disabled$/],
          greedy: [/safe$/]
        }
      },
      // Add vendor prefixes for better browser support
      'postcss-preset-env': {
        autoprefixer: {
          flexbox: 'no-2009'
        },
        stage: 3,
        features: {
          'custom-properties': false,
          'nesting-rules': true
        }
      }
    } : {})
  }
};
