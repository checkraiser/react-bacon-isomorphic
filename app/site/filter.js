
const Bacon      = require('baconjs'),
      Dispatcher = require('./dispatcher')

const d = new Dispatcher()

module.exports = {
  toProperty: function(initialFilter, pathS) {
    return d
      .stream('reset')
      .merge(pathS.map(path => path.substring(1)))
      .scan(initialFilter || 'all', (_, newFilter) => newFilter || 'all')
  },

  reset: function(newFilter) {
    history.pushState({}, '', '/' + newFilter)
    d.push('reset', newFilter)
  }
}
