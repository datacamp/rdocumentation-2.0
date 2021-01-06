/* eslint-disable global-require */
module.exports = {
  darkMode: 'class',
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
  purge: ['./components/**/*.{js,ts,jsx,tsx}', './pages/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'dc-beige100': '#FFFBF3',
        'dc-beige200': '#F7F3EB',
        'dc-beige300': '#EFEBE4',
        'dc-beige400': '#E5E1DA',
        'dc-blue': '#06BDFC',
        'dc-green': '#03EF62',
        'dc-grey100': '#F7F7FC',
        'dc-grey200': '#EFEFEF',
        'dc-grey300': '#E8E8EA',
        'dc-grey400': '#D9D9E2',
        'dc-navy': '#05192D',
        'dc-orange': '#FF931E',
        'dc-pink': '#FF6EA9',
        'dc-purple': '#7933FF',
        'dc-red': '#FF5400',
        'dc-yellow': '#FCCE0D',
      },
    },
  },
  variants: {
    extend: {
      borderColor: ['dark'],
    },
  },
};
