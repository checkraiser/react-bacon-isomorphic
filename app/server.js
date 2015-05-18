const express     = require('express'),
      fs          = require('fs'),
      {resolve}   = require('path'),
      serveStatic = require('serve-static'),
      React       = require('react'),
      TodoApp     = require('./client/todoApp'),
      appState    = require('./client/appState')


const app   = express(),
      index = fs.readFileSync(resolve(__dirname, '../index.html')).toString()

const items = [
  {id: 1234, title: 'Tsers', states: []},
  {id: 2345, title: 'Foobar', states: []}
]

app.use('/public', serveStatic(resolve(__dirname, '../public')))
app.get('/:filter?', (req, res) => {
  const filter = req.params.filter || 'all'
  appState({initialState: {items, filter}})
    .take(1)
    .onValue((model) => {
      res.set('Content-Type', 'text/html')
      res.send(index
        .replace('{{APP}}', React.renderToString(<TodoApp {...model} />))
        .replace('{{INITIAL_MODEL}}', JSON.stringify(model)))
    })
})

app.listen(3000, () => console.log('Server listening on port 3000'))
