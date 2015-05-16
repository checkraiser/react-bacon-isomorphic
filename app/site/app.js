
const React    = require('react'),
      Bacon    = require('baconjs'),
      appState = require('./appState'),
      TodoApp  = require('./todoApp')

const pathStream = Bacon.fromBinder((sink) => {
  window.onpopstate = () => sink(location.pathname)
})

const stateStream = appState({
  initialState: window.INITIAL_MODEL,
  pathS: pathStream
})

stateStream.onValue((state) => {
  React.render(<TodoApp {...state} />, document.getElementById('todoapp'))
})
