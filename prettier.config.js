const sPrettier = require('s-prettier')

module.exports = {
  ...sPrettier,
  plugins: [require('prettier-plugin-tailwindcss')],
};
