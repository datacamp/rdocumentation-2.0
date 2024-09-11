module.exports = {
  async redirects() {
    return [
      {
        destination: '/',
        source: '/trends',
        statusCode: 301,
      },
      {
        destination: '/',
        source: '/taskviews',
        statusCode: 301,
      },
    ];
  },
};
