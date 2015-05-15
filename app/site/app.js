
const React    = require('react'),
      Bacon    = require('baconjs'),
      appState = require('./appState'),
      TodoApp = require('./todoApp')

const stateStream = appState(window.INITIAL_MODEL)

stateStream.onValue((state) => {
  React.render(<TodoApp {...state} />, document.getElementById('todoapp'))
})
