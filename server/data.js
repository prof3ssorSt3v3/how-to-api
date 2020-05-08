//Our in-memory database

const users = [
  {
    _id: 1587912698986,
    api_key: 'an0qrr5i9u0q4km27hv2hue3ywx3uu',
    email: 'steve@home.org',
    host: 'http://127.0.0.1:5500',
    usage: [{ date: '2020-05-08', count: 17 }],
  },
];

const cheeses = [
  { _id: 1, name: 'Cheddar' },
  { _id: 2, name: 'Mozzarella' },
];

module.exports = { users, cheeses };
