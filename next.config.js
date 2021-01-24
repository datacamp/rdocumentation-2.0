module.exports = {
  async redirects() {
    return [
      {
        destination: '/',
        permanent: false,
        source: '/trends',
      },
      {
        destination: '/',
        permanent: false,
        source: '/taskviews',
      },
      {
        destination: '/',
        permanent: false,
        source: '/collaborators/name/:name*',
      },
    ];
  },
};
