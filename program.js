var express = require('express');
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var app = express();
app.use(express.static('public'));
// app.use(jsonParser())

var Items = function() {
    this.items = [];
    this.id = 0;
};

Items.prototype.add = function(name) {
    var item = {name: name, id: this.id};
    this.items.push(item);
    this.id += 1;
    return item;
};

Items.prototype.delete = function(id) {
  for (var i = 0; i < this.items.length; i++) {
    if (this.items[i].id === id) {
      var item = this.items[i]
      this.items.splice(i, 1)
      return item.name + ' deleted'
    }
  }
  return 'ungraceful fail'
  // DONE return item deleted
  // TODO fail gracefully returning a JSON error message
}

Items.prototype.update = function(id, name) {
  for (var i = 0; i < this.items.length; i++){
    if (this.items[i].id === id) {
      var item = this.items[i]
      this.items[i].name = name
    }
  }
}

/*Items.prototype.update = function(id, name){
  for (var i = 0; i < this.items.length; i++) {
    if (this.items[i].id === id) {
      this.items.splice(i, 1)
    }
  }
}*/

/*Items.prototype.update = function(item) {
    // find the index of the item we want to update
    var success = false    
    for (var i=0; i < this.items.length; i++) {
        if (this.items[i].id === item.id) {
            this.items[i].name = item.name
            success = true
            break
        }
    }
    if (success === false) {
        this.items.push(item)
    }
}*/

var items = new Items();
items.add('Bacon'); // 0
items.add('Eggs'); // 1
items.update(1, 'Huevina')
items.add('Potatoes'); // 2
// items.delete(1) // Eggs



app.get('/items', function(req, res) {
  res.json(items.items);
});

// TODO tell express to use jsonParser middleware
app.post('/items', jsonParser, function(req, res) {
  if (!req.body) {
    return res.sendStatus(400)
  }
  // DONE what is the .body property?
  // returns { name: 'eggs' }
  // DONE the .name property? -> 'eggs'
  var item = items.add(req.body.name)
  // returns obj with format { name: 'eggs', id: 3 }
  // TODO .json prop of result of .status(num) method of res?
  res.status(201).json(item)
})

app.delete('/items/:id', function(req, res){
  items.delete(parseInt(req.params.id))
  res.end()
})

// HTTP PUT /items/4
// application/JSON
// why does the FE send the id KV pair when it's
// already in the URL?

// {"name": "bacon", "id": 4}
app.put('/items/:id', jsonParser, function(req, res){
  items.update(parseInt(req.params.id), req.body.name)
  res.end()
})

app.listen(process.env.PORT || 8080,
            function(){console.log('listening...')});