
const Bacon      = require('baconjs'),
      Dispatcher = require('./dispatcher')

const d = new Dispatcher()

module.exports = {
  toProperty: function(initialFilter, pathS) {
    return d.stream('reset')
      .doAction(newFilter => console.log('asdasdsas') || history.pushState({}, '', newFilter))
      .merge(pathS.map(path => path.substring(1)))
      .scan(initialFilter || 'all', (_, newFilter) => newFilter || 'all')
  },

  reset: function(newFilter) {
    d.push('reset', newFilter)
  }
}
