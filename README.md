# GhostTrain-Backbone

[![browser support](https://ci.testling.com/jsantell/GhostTrain-Backbone.png)](https://ci.testling.com/jsantell/GhostTrain-Backbone)

[![Build Status](https://travis-ci.org/jsantell/GhostTrain-Backbone.png)](https://travis-ci.org/jsantell/GhostTrain-Backbone)

[GhostTrain](http://ghosttrainjs.com) plugin to mock routes for [Backbone](http://backbonejs.com) models.

## Usage

```javascript
var gt = new GhostTrain();

var users = {
  '1': {
    name: 'Ozzie Isaacs',
    skills: ['Planet Riding']
  }
}

gt.get('/users/:id', function (req, res) {
  res.send(200, users[req.parms.id]);
});

var User = Backbone.Model.extend(GhostTrainBackbone(gt)).extend({
  urlRoot: '/users'
});
```

In action:

```javascript
var user = new User({ id: 1 });
user.fetch({
  success: function (model, res) {
    user.get('name'); // 'Ozzie Isaacs'
    user.get('skills'); // ['Planet Riding']
  });
});
```

## API

### GhostTrainBackbone(gt, [$])

Takes a `GhostTrain` instance and an optional reference to the jQuery root. Returns an object
containing only a `sync` property containing a function that mocks `Backbone.sync` for 
Backbone models and collections. Use the return object to mixin your models and collections.
If `$` is provided, Backbone methods that returned the `JQXHR` object returned from the `$.ajax`
call will now return a `$.Deferred` object.
