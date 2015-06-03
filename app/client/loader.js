
const Bacon      = require('baconjs'),
      Dispatcher = require('./dispatcher')

const d = new Dispatcher()

module.exports = {
  toProperty: function () {
    return d.stream('loading').scan(false, (_, loading) => loading)
  },

  loading: function(isLoading) {
    d.push('loading', isLoading)
  }
}
