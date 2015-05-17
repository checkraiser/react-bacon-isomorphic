
const React   = require('react'),
      Bacon   = require('baconjs'),
      todos   = require('./todos'),
      filter  = require('./filter'),
      loader  = require('./loader')

module.exports = function({initialState, pathS}) {
  const filterP  = filter.toProperty(initialState.filter, pathS || Bacon.never()),
        itemsP   = todos.toItemsProperty(initialState.items, filterP),
        loadingP = loader.toProperty()

  return Bacon.combineTemplate({
    items: itemsP,
    filter: filterP,
    loading: loadingP
  })
}
