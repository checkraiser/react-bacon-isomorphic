
const React   = require('react'),
      Bacon   = require('baconjs'),
      TodoApp = require('./todoApp'),
      todos   = require('./todos'),
      filter  = require('./filter')


const filterP = filter.toProperty(window.location.hash.substring(1) || 'all'),
      itemsP  = todos.toItemsProperty(window.INITIAL_MODEL.items, filterP)

const appState = Bacon.combineTemplate({
  items: itemsP,
  filter: filterP
})

appState.onValue((state) => {
  React.render(<TodoApp {...state} />, document.getElementById('todoapp'))
})
