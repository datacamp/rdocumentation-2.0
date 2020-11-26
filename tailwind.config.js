module.exports = {
  purge: ['./components/**/*.{js,ts,jsx,tsx}', './pages/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'dc-navy': '#05192D',
        'dc-green': '#03EF62',
        'dc-blue': '#06BDFC',
        'dc-red': '#FF5400',
        'dc-orange': '#FF931E',
        'dc-purple': '#7933FF',
        'dc-pink': '#FF6EA9',
        'dc-yellow': '#FCCE0D',
        'dc-beige100': '#FFFBF3',
        'dc-beige200': '#F7F3EB',
        'dc-beige300': '#EFEBE4',
        'dc-beige400': '#E5E1DA',
        'dc-grey100': '#F7F7FC',
        'dc-grey200': '#EFEFEF',
        'dc-grey300': '#E8E8EA',
        'dc-grey400': '#D9D9E2',
      },
    },
  },
  variants: {},
  plugins: [require('@tailwindcss/forms')],
};
