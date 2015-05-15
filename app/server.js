const express     = require('express'),
      fs          = require('fs'),
      {resolve}   = require('path'),
      serveStatic = require('serve-static'),
      bodyParser  = require('body-parser'),
      React       = require('react'),
      pmongo      = require('promised-mongo'),
      TodoApp     = require('./site/todoApp'),
      app         = express()

const items = pmongo('react-bacon-isomorphic').collection('items')

const _index = fs.readFileSync(resolve(__dirname, '../index.html')).toString()

app.use(bodyParser.json())
app.use('/public', serveStatic(resolve(__dirname, '../public')))
app.get('/', (req, res) => {
  findAllItems()
    .then((items) => {
      const model = {items}
      res.set('Content-Type', 'text/html')
      res.send(_index
        .replace('{{APP}}', React.renderToString(<TodoApp {...model} />))
        .replace('{{INITIAL_MODEL}}', JSON.stringify(model)))
    })
    .done()
})

app.post('/api/items', (req, res) => {
  itemsOp(res, items.insert(req.body))
})

app.put('/api/items/:id/state', (req, res) => {
  itemsOp(res, items.update({_id: pmongo.ObjectId(req.params.id)}, {$addToSet: {states: req.body.state}}))
})

app.put('/api/items/:id/title', (req, res) => {
  itemsOp(res, items.update({_id: pmongo.ObjectId(req.params.id)}, {$set: {title: req.body.title}}))
})

app.delete('/api/items/:id/state', (req, res) => {
  itemsOp(res, items.update({_id: pmongo.ObjectId(req.params.id)}, {$pull: {states: req.body.state}}))
})

app.delete('/api/items/completed', (req, res) => {
  itemsOp(res, items.remove({states: 'completed'}))
})

app.delete('/api/items/:id', (req, res) => {
  itemsOp(res, items.remove({_id: pmongo.ObjectId(req.params.id)}))
})


app.listen(3000, () => console.log('Server listening on port 3000'))

function itemsOp(res, promise) {
  promise
    .then(findAllItems)
    .then(docs => res.json(docs))
    .done()
}

function findAllItems() {
  return items.find({}).toArray().then(docs => docs.map(d => Object.assign({}, d, {id: d._id, display: true})))
}
