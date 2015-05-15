
const React   = require('react'),
      Bacon   = require('baconjs'),
      todos   = require('./todos'),
      filter  = require('./filter'),
      loader  = require('./loader')



module.exports = function(initialState) {
  const filterP  = filter.toProperty(initialState.filter || 'all'),
        itemsP   = todos.toItemsProperty(initialState.items, filterP),
        loadingP = loader.toProperty()

  return Bacon.combineTemplate({
    items: itemsP,
    filter: filterP,
    loading: loadingP
  })
}
