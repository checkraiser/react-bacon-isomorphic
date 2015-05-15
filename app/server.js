const express     = require('express'),
      fs          = require('fs'),
      {resolve}   = require('path'),
      serveStatic = require('serve-static'),
      React       = require('react'),
      TodoApp     = require('./site/todoApp'),
      app         = express()


const _index = fs.readFileSync(resolve(__dirname, '../index.html')).toString()

app.use('/public', serveStatic(resolve(__dirname, '../public')))
app.get('/', (req, res) => {
  const model = {
    items: [
      {id: 1234, title: 'Make an isomorphic example', states: ['completed'], display: true},
      {id: 2345, title: 'Write a blog post', states: [], display: true}
    ]
  }
  res.set('Content-Type', 'text/html')
  res.send(_index
    .replace('{{APP}}', React.renderToString(<TodoApp {...model} />))
    .replace('{{INITIAL_MODEL}}', JSON.stringify(model)))
})

app.listen(3000, () => console.log('Server listening on port 3000'))
