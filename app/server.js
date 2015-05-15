const express = require('express'),
      fs      = require('fs'),
      path    = require('path'),
      app     = express()


const _index = fs.readFileSync(path.resolve(__dirname, '../index.html')).toString()

app.get('/', (req, res) => {
  res.set('Content-Type', 'text/html')
  res.send(_index)
})

app.get('/styles/base.css', (req, res) => {
  res.set('Content-Type', 'text/css')
  res.sendFile(path.resolve(__dirname, '../node_modules/todomvc-common/base.css'))
})

app.get('/styles/index.css', (req, res) => {
  res.set('Content-Type', 'text/css')
  res.sendFile(path.resolve(__dirname, '../node_modules/todomvc-app-css/index.css'))
})

app.get('/js/app.js', (req, res) => {
  res.set('Content-Type', 'text/javascript')
  res.sendFile(path.resolve(__dirname, '../build/bundle.js'))
})

app.listen(3000, () => console.log('Server listening on port 3000'))
