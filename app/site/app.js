
const React   = require('react'),
      Bacon   = require('baconjs'),
      TodoApp = require('./todoApp'),
      todos   = require('./todos'),
      filter  = require('./filter'),
      loader  = require('./loader')


const filterP  = filter.toProperty(window.location.hash.substring(1) || 'all'),
      itemsP   = todos.toItemsProperty(window.INITIAL_MODEL.items, filterP),
      loadingP = loader.toProperty()

const appState = Bacon.combineTemplate({
  items: itemsP,
  filter: filterP,
  loading: loadingP
})

appState.onValue((state) => {
  React.render(<TodoApp {...state} />, document.getElementById('todoapp'))
})
