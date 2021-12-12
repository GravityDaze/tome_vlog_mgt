module.exports = {
  content: [],
  theme: {
    minWidth: {
      96: '24rem'
    },
    extend: {
      backgroundImage: {
        login:
          "url('https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?cs=srgb&dl=pexels-sam-kolder-2387873.jpg&fm=jpg')"
      }
    }
  },
  plugins: [],
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}']
}
