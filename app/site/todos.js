
const Bacon       = require('baconjs'),
      R           = require('ramda'),
      Dispatcher  = require('./dispatcher'),
      loader      = require('./loader')

const qwest = () => require('qwest')

const d = new Dispatcher()

module.exports = {
  toItemsProperty: function(initialItems, filterS) {

    const itemsS = Bacon.update(initialItems,
      [d.stream('update:server')],    updateItemsFromServer,
      [d.stream('remove')],           removeItem,
      [d.stream('create')],           createItem,
      [d.stream('addState')],         addItemState,
      [d.stream('removeState')],      removeItemState,
      [d.stream('removeCompleted')],  removeCompleteItems,
      [d.stream('updateTitle')],      updateItemTitle
    )

    return Bacon.combineAsArray([itemsS, filterS]).map(withDisplayStatus)


    function updateItemsFromServer(_, itemsFromServer) {
      loader.loading(false)
      return itemsFromServer
    }

    function createItem(items, newItemTitle) {
      loader.loading(true)
      d.plug('update:server', Bacon.fromPromise(qwest().post('/api/items',
        {title: newItemTitle, states: []}, {dataType: 'json'})))
      return items
    }

    function removeItem(items, itemIdToRemove) {
      loader.loading(true)
      d.plug('update:server', Bacon.fromPromise(qwest().delete('/api/items/' + itemIdToRemove)))
      return items
    }

    function removeCompleteItems(items) {
      loader.loading(true)
      d.plug('update:server', Bacon.fromPromise(qwest().delete('/api/items/completed')))
      return items
    }

    function addItemState(items, {itemId, state}) {
      loader.loading(true)
      d.plug('update:server', Bacon.fromPromise(qwest().put('/api/items/' + itemId + '/state',
        {state}, {dataType: 'json'})))
      return items
    }

    function removeItemState(items, {itemId, state}) {
      loader.loading(true)
      d.plug('update:server', Bacon.fromPromise(qwest().delete('/api/items/' + itemId + '/state/' + state)))
      return items
    }

    function updateItemTitle(items, {itemId, title}) {
      qwest().put('/api/items/' + itemId + '/title', {title}, {dataType: 'json'})
      return items
    }

    function withDisplayStatus([items, filter]) {
      function setDisplay(it) {
        const display = filter === 'completed' ? isItemCompleted(it) : filter === 'active' ? !isItemCompleted(it) : true
        return R.merge(it, {display})
      }
      return R.map(setDisplay, items)
    }
  },

  // "public" methods

  isCompleted: isItemCompleted,

  isEdited: isItemEdited,

  createItem: function(title) {
    d.push('create', title)
  },

  removeItem: function(itemId) {
    d.push('remove', itemId)
  },

  removeCompleted: function() {
    d.push('removeCompleted')
  },

  setTitle: function(itemId, title) {
    d.push('updateTitle', {itemId, title})
  },

  setCompleted: function(itemId, completed) {
    d.push(completed ? 'addState' : 'removeState', {itemId, state: 'completed'})
  },

  setAllCompleted: function(completed) {
    d.push(completed ? 'addState' : 'removeState', {itemId: 'all', state: 'completed'})
  },

  setEditing: function(itemId, editing) {
    d.push(editing ? 'addState' : 'removeState', {itemId, state: 'editing'})
  }

}


function isItemCompleted(item) {
  return R.contains('completed', item.states)
}

function isItemEdited(item) {
  return R.contains('editing', item.states)
}

function updateItem(itemId, fn) {
  return (it) => itemId === 'all' || it.id === itemId ? fn(it) : it
}

